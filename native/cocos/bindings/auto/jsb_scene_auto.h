// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_geometry_auto.h"
#include "cocos/bindings/auto/jsb_assets_auto.h"
#include "cocos/core/data/Object.h"
#include "cocos/core/scene-graph/Node.h"
#include "cocos/core/scene-graph/Scene.h"
#include "cocos/core/scene-graph/SceneGlobals.h"
#include "cocos/scene/Light.h"
#include "cocos/scene/Fog.h"
#include "cocos/scene/Shadow.h"
#include "cocos/scene/Skybox.h"
#include "cocos/scene/DirectionalLight.h"
#include "cocos/scene/SpotLight.h"
#include "cocos/scene/SphereLight.h"
#include "cocos/scene/Model.h"
#include "cocos/scene/SubModel.h"
#include "cocos/scene/Pass.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/DrawBatch2D.h"
#include "cocos/scene/RenderWindow.h"
#include "cocos/scene/Camera.h"
#include "cocos/scene/Define.h"
#include "cocos/scene/Ambient.h"
#include "cocos/renderer/core/PassInstance.h"
#include "cocos/renderer/core/MaterialInstance.h"
#include "cocos/3d/models/MorphModel.h"
#include "cocos/3d/models/SkinningModel.h"
#include "cocos/3d/models/BakedSkinningModel.h"
#include "cocos/core/Root.h"
#include "cocos/renderer/core/ProgramLib.h"
#include "cocos/scene/Octree.h"

bool register_all_scene(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::BaseNode);
JSB_REGISTER_OBJECT_TYPE(cc::Node);
JSB_REGISTER_OBJECT_TYPE(cc::Scene);
JSB_REGISTER_OBJECT_TYPE(cc::SceneGlobals);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Light);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Fog);
JSB_REGISTER_OBJECT_TYPE(cc::scene::FogInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::IMacroPatch);
JSB_REGISTER_OBJECT_TYPE(cc::scene::ShadowsInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Shadows);
JSB_REGISTER_OBJECT_TYPE(cc::scene::SubModel);
JSB_REGISTER_OBJECT_TYPE(cc::scene::InstancedAttributeBlock);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Model);
JSB_REGISTER_OBJECT_TYPE(cc::scene::IRenderSceneInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::RenderScene);
JSB_REGISTER_OBJECT_TYPE(cc::scene::IRenderWindowInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::RenderWindow);
JSB_REGISTER_OBJECT_TYPE(cc::scene::SphereLight);
JSB_REGISTER_OBJECT_TYPE(cc::Root);
JSB_REGISTER_OBJECT_TYPE(cc::scene::SkyboxInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Skybox);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Ambient);
JSB_REGISTER_OBJECT_TYPE(cc::scene::AmbientInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::DirectionalLight);
JSB_REGISTER_OBJECT_TYPE(cc::scene::SpotLight);
JSB_REGISTER_OBJECT_TYPE(cc::scene::PassDynamicsValue);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Pass);
JSB_REGISTER_OBJECT_TYPE(cc::scene::DrawBatch2D);
JSB_REGISTER_OBJECT_TYPE(cc::scene::ICameraInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Camera);
JSB_REGISTER_OBJECT_TYPE(cc::PassInstance);
JSB_REGISTER_OBJECT_TYPE(cc::IMaterialInstanceInfo);
JSB_REGISTER_OBJECT_TYPE(cc::MaterialInstance);
JSB_REGISTER_OBJECT_TYPE(cc::MorphModel);
JSB_REGISTER_OBJECT_TYPE(cc::SkinningModel);
JSB_REGISTER_OBJECT_TYPE(cc::BakedSkinningModel);
JSB_REGISTER_OBJECT_TYPE(cc::IDefineRecord);
JSB_REGISTER_OBJECT_TYPE(cc::IProgramInfo);
JSB_REGISTER_OBJECT_TYPE(cc::ProgramLib);
JSB_REGISTER_OBJECT_TYPE(cc::scene::OctreeInfo);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Octree);


extern se::Object *__jsb_cc_BaseNode_proto; // NOLINT
extern se::Class * __jsb_cc_BaseNode_class; // NOLINT

bool js_register_cc_BaseNode(se::Object *obj); // NOLINT


extern se::Object *__jsb_cc_Node_proto; // NOLINT
extern se::Class * __jsb_cc_Node_class; // NOLINT

bool js_register_cc_Node(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Node__setChildren);
SE_DECLARE_FUNC(js_scene_Node_addChild);
SE_DECLARE_FUNC(js_scene_Node_destroyAllChildren);
SE_DECLARE_FUNC(js_scene_Node_getChildByName);
SE_DECLARE_FUNC(js_scene_Node_getChildByPath);
SE_DECLARE_FUNC(js_scene_Node_getChildByUuid);
SE_DECLARE_FUNC(js_scene_Node_getEventMask);
SE_DECLARE_FUNC(js_scene_Node_getLayer);
SE_DECLARE_FUNC(js_scene_Node_getParent);
SE_DECLARE_FUNC(js_scene_Node_getScene);
SE_DECLARE_FUNC(js_scene_Node_getSiblingIndex);
SE_DECLARE_FUNC(js_scene_Node_insertChild);
SE_DECLARE_FUNC(js_scene_Node_invalidateChildren);
SE_DECLARE_FUNC(js_scene_Node_inverseTransformPoint);
SE_DECLARE_FUNC(js_scene_Node_isChildOf);
SE_DECLARE_FUNC(js_scene_Node_lookAt);
SE_DECLARE_FUNC(js_scene_Node_off);
SE_DECLARE_FUNC(js_scene_Node_onPostActivated);
SE_DECLARE_FUNC(js_scene_Node_pauseSystemEvents);
SE_DECLARE_FUNC(js_scene_Node_removeAllChildren);
SE_DECLARE_FUNC(js_scene_Node_removeChild);
SE_DECLARE_FUNC(js_scene_Node_removeFromParent);
SE_DECLARE_FUNC(js_scene_Node_resumeSystemEvents);
SE_DECLARE_FUNC(js_scene_Node_setEulerAngles);
SE_DECLARE_FUNC(js_scene_Node_setEventMask);
SE_DECLARE_FUNC(js_scene_Node_setForward);
SE_DECLARE_FUNC(js_scene_Node_setLayer);
SE_DECLARE_FUNC(js_scene_Node_setParent);
SE_DECLARE_FUNC(js_scene_Node_setPositionForJS);
SE_DECLARE_FUNC(js_scene_Node_setPositionInternal);
SE_DECLARE_FUNC(js_scene_Node_setRTSInternal);
SE_DECLARE_FUNC(js_scene_Node_setRotationForJS);
SE_DECLARE_FUNC(js_scene_Node_setRotationFromEulerForJS);
SE_DECLARE_FUNC(js_scene_Node_setRotationInternal);
SE_DECLARE_FUNC(js_scene_Node_setScaleForJS);
SE_DECLARE_FUNC(js_scene_Node_setScaleInternal);
SE_DECLARE_FUNC(js_scene_Node_setSiblingIndex);
SE_DECLARE_FUNC(js_scene_Node_setUIPropsTransformDirtyPtr);
SE_DECLARE_FUNC(js_scene_Node_setWorldPosition);
SE_DECLARE_FUNC(js_scene_Node_setWorldRotation);
SE_DECLARE_FUNC(js_scene_Node_setWorldRotationFromEuler);
SE_DECLARE_FUNC(js_scene_Node_setWorldScale);
SE_DECLARE_FUNC(js_scene_Node_targetOff);
SE_DECLARE_FUNC(js_scene_Node_translate);
SE_DECLARE_FUNC(js_scene_Node_updateSiblingIndex);
SE_DECLARE_FUNC(js_scene_Node_updateWorldTransform);
SE_DECLARE_FUNC(js_scene_Node_walk);
SE_DECLARE_FUNC(js_scene_Node_clearNodeArray);
SE_DECLARE_FUNC(js_scene_Node_getIdxOfChild);
SE_DECLARE_FUNC(js_scene_Node_instantiate);
SE_DECLARE_FUNC(js_scene_Node_resetChangedFlags);
SE_DECLARE_FUNC(js_scene_Node_setScene);
SE_DECLARE_FUNC(js_scene_Node_Node);

extern se::Object *__jsb_cc_Scene_proto; // NOLINT
extern se::Class * __jsb_cc_Scene_class; // NOLINT

bool js_register_cc_Scene(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Scene_activate);
SE_DECLARE_FUNC(js_scene_Scene_getRenderScene);
SE_DECLARE_FUNC(js_scene_Scene_getSceneGlobals);
SE_DECLARE_FUNC(js_scene_Scene_load);
SE_DECLARE_FUNC(js_scene_Scene_onBatchCreated);
SE_DECLARE_FUNC(js_scene_Scene_setSceneGlobals);
SE_DECLARE_FUNC(js_scene_Scene_Scene);

extern se::Object *__jsb_cc_SceneGlobals_proto; // NOLINT
extern se::Class * __jsb_cc_SceneGlobals_class; // NOLINT

bool js_register_cc_SceneGlobals(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_SceneGlobals_activate);
SE_DECLARE_FUNC(js_scene_SceneGlobals_getAmbientInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_getFogInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_getOctreeInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_getShadowsInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_getSkyboxInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_setAmbientInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_setFogInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_setOctreeInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_setShadowsInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_setSkyboxInfo);
SE_DECLARE_FUNC(js_scene_SceneGlobals_SceneGlobals);

extern se::Object *__jsb_cc_scene_Light_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Light_class; // NOLINT

bool js_register_cc_scene_Light(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Light_attachToScene);
SE_DECLARE_FUNC(js_scene_Light_destroy);
SE_DECLARE_FUNC(js_scene_Light_detachFromScene);
SE_DECLARE_FUNC(js_scene_Light_initialize);
SE_DECLARE_FUNC(js_scene_Light_update);
SE_DECLARE_FUNC(js_scene_Light_nt2lm);
SE_DECLARE_FUNC(js_scene_Light_Light);

extern se::Object *__jsb_cc_scene_Fog_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Fog_class; // NOLINT

bool js_register_cc_scene_Fog(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Fog_activate);
SE_DECLARE_FUNC(js_scene_Fog_initialize);
SE_DECLARE_FUNC(js_scene_Fog_isAccurate);
SE_DECLARE_FUNC(js_scene_Fog_setAccurate);
SE_DECLARE_FUNC(js_scene_Fog_setfogRange);
SE_DECLARE_FUNC(js_scene_Fog_Fog);

extern se::Object *__jsb_cc_scene_FogInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_FogInfo_class; // NOLINT

bool js_register_cc_scene_FogInfo(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_FogInfo_activate);
SE_DECLARE_FUNC(js_scene_FogInfo_FogInfo);

extern se::Object *__jsb_cc_scene_IMacroPatch_proto; // NOLINT
extern se::Class * __jsb_cc_scene_IMacroPatch_class; // NOLINT

bool js_register_cc_scene_IMacroPatch(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::scene::IMacroPatch *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_scene_ShadowsInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_ShadowsInfo_class; // NOLINT

bool js_register_cc_scene_ShadowsInfo(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_ShadowsInfo_activate);
SE_DECLARE_FUNC(js_scene_ShadowsInfo_getShadowMapSize);
SE_DECLARE_FUNC(js_scene_ShadowsInfo_setFixedArea);
SE_DECLARE_FUNC(js_scene_ShadowsInfo_setPlaneFromNode);
SE_DECLARE_FUNC(js_scene_ShadowsInfo_setShadowMapSize);
SE_DECLARE_FUNC(js_scene_ShadowsInfo_ShadowsInfo);

extern se::Object *__jsb_cc_scene_Shadows_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Shadows_class; // NOLINT

bool js_register_cc_scene_Shadows(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Shadows_activate);
SE_DECLARE_FUNC(js_scene_Shadows_destroy);
SE_DECLARE_FUNC(js_scene_Shadows_getMaterial);
SE_DECLARE_FUNC(js_scene_Shadows_getMaxReceived);
SE_DECLARE_FUNC(js_scene_Shadows_getPlanarInstanceShader);
SE_DECLARE_FUNC(js_scene_Shadows_getPlanarShader);
SE_DECLARE_FUNC(js_scene_Shadows_getShadowColor4f);
SE_DECLARE_FUNC(js_scene_Shadows_getShadowMapSize);
SE_DECLARE_FUNC(js_scene_Shadows_initialize);
SE_DECLARE_FUNC(js_scene_Shadows_isFixedArea);
SE_DECLARE_FUNC(js_scene_Shadows_setMaxReceived);
SE_DECLARE_FUNC(js_scene_Shadows_setShadowMapSize);
SE_DECLARE_FUNC(js_scene_Shadows_Shadows);

extern se::Object *__jsb_cc_scene_SubModel_proto; // NOLINT
extern se::Class * __jsb_cc_scene_SubModel_class; // NOLINT

bool js_register_cc_scene_SubModel(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_SubModel_destroy);
SE_DECLARE_FUNC(js_scene_SubModel_getId);
SE_DECLARE_FUNC(js_scene_SubModel_getOwner);
SE_DECLARE_FUNC(js_scene_SubModel_getPass);
SE_DECLARE_FUNC(js_scene_SubModel_getShader);
SE_DECLARE_FUNC(js_scene_SubModel_getWorldBoundDescriptorSet);
SE_DECLARE_FUNC(js_scene_SubModel_initPlanarShadowInstanceShader);
SE_DECLARE_FUNC(js_scene_SubModel_initPlanarShadowShader);
SE_DECLARE_FUNC(js_scene_SubModel_initialize);
SE_DECLARE_FUNC(js_scene_SubModel_onMacroPatchesStateChanged);
SE_DECLARE_FUNC(js_scene_SubModel_onPipelineStateChanged);
SE_DECLARE_FUNC(js_scene_SubModel_setOwner);
SE_DECLARE_FUNC(js_scene_SubModel_setWorldBoundDescriptorSet);
SE_DECLARE_FUNC(js_scene_SubModel_update);
SE_DECLARE_FUNC(js_scene_SubModel_SubModel);

extern se::Object *__jsb_cc_scene_InstancedAttributeBlock_proto; // NOLINT
extern se::Class * __jsb_cc_scene_InstancedAttributeBlock_class; // NOLINT

bool js_register_cc_scene_InstancedAttributeBlock(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::scene::InstancedAttributeBlock *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_scene_Model_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Model_class; // NOLINT

bool js_register_cc_scene_Model(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Model_attachToScene);
SE_DECLARE_FUNC(js_scene_Model_createBoundingShape);
SE_DECLARE_FUNC(js_scene_Model_destroy);
SE_DECLARE_FUNC(js_scene_Model_detachFromScene);
SE_DECLARE_FUNC(js_scene_Model_getInstMatWorldIdx);
SE_DECLARE_FUNC(js_scene_Model_getInstanceAttributes);
SE_DECLARE_FUNC(js_scene_Model_getInstancedAttributeIndex);
SE_DECLARE_FUNC(js_scene_Model_getInstancedBuffer);
SE_DECLARE_FUNC(js_scene_Model_getInstancedBufferSize);
SE_DECLARE_FUNC(js_scene_Model_getLocalData);
SE_DECLARE_FUNC(js_scene_Model_getMacroPatches);
SE_DECLARE_FUNC(js_scene_Model_initLocalDescriptors);
SE_DECLARE_FUNC(js_scene_Model_initSubModel);
SE_DECLARE_FUNC(js_scene_Model_initWorldBoundDescriptors);
SE_DECLARE_FUNC(js_scene_Model_initialize);
SE_DECLARE_FUNC(js_scene_Model_isModelImplementedInJS);
SE_DECLARE_FUNC(js_scene_Model_onGlobalPipelineStateChanged);
SE_DECLARE_FUNC(js_scene_Model_onMacroPatchesStateChanged);
SE_DECLARE_FUNC(js_scene_Model_setBounds);
SE_DECLARE_FUNC(js_scene_Model_setCalledFromJS);
SE_DECLARE_FUNC(js_scene_Model_setInstMatWorldIdx);
SE_DECLARE_FUNC(js_scene_Model_setInstancedAttributesViewData);
SE_DECLARE_FUNC(js_scene_Model_setSubModelMaterial);
SE_DECLARE_FUNC(js_scene_Model_setSubModelMesh);
SE_DECLARE_FUNC(js_scene_Model_updateInstancedAttributes);
SE_DECLARE_FUNC(js_scene_Model_updateLightingmap);
SE_DECLARE_FUNC(js_scene_Model_updateLocalDescriptors);
SE_DECLARE_FUNC(js_scene_Model_updateTransform);
SE_DECLARE_FUNC(js_scene_Model_updateUBOs);
SE_DECLARE_FUNC(js_scene_Model_updateWorldBound);
SE_DECLARE_FUNC(js_scene_Model_updateWorldBoundDescriptors);
SE_DECLARE_FUNC(js_scene_Model_updateWorldBoundUBOs);
SE_DECLARE_FUNC(js_scene_Model_updateWorldBoundsForJSBakedSkinningModel);
SE_DECLARE_FUNC(js_scene_Model_updateWorldBoundsForJSSkinningModel);
SE_DECLARE_FUNC(js_scene_Model_Model);

extern se::Object *__jsb_cc_scene_IRenderSceneInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_IRenderSceneInfo_class; // NOLINT

bool js_register_cc_scene_IRenderSceneInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::scene::IRenderSceneInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_scene_RenderScene_proto; // NOLINT
extern se::Class * __jsb_cc_scene_RenderScene_class; // NOLINT

bool js_register_cc_scene_RenderScene(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_RenderScene_activate);
SE_DECLARE_FUNC(js_scene_RenderScene_addBatch);
SE_DECLARE_FUNC(js_scene_RenderScene_addCamera);
SE_DECLARE_FUNC(js_scene_RenderScene_addDirectionalLight);
SE_DECLARE_FUNC(js_scene_RenderScene_addModel);
SE_DECLARE_FUNC(js_scene_RenderScene_addSphereLight);
SE_DECLARE_FUNC(js_scene_RenderScene_addSpotLight);
SE_DECLARE_FUNC(js_scene_RenderScene_destroy);
SE_DECLARE_FUNC(js_scene_RenderScene_generateModelId);
SE_DECLARE_FUNC(js_scene_RenderScene_getBatches);
SE_DECLARE_FUNC(js_scene_RenderScene_getDrawBatch2Ds);
SE_DECLARE_FUNC(js_scene_RenderScene_getOctree);
SE_DECLARE_FUNC(js_scene_RenderScene_initialize);
SE_DECLARE_FUNC(js_scene_RenderScene_onGlobalPipelineStateChanged);
SE_DECLARE_FUNC(js_scene_RenderScene_removeBatch);
SE_DECLARE_FUNC(js_scene_RenderScene_removeBatches);
SE_DECLARE_FUNC(js_scene_RenderScene_removeCamera);
SE_DECLARE_FUNC(js_scene_RenderScene_removeCameras);
SE_DECLARE_FUNC(js_scene_RenderScene_removeDirectionalLight);
SE_DECLARE_FUNC(js_scene_RenderScene_removeModel);
SE_DECLARE_FUNC(js_scene_RenderScene_removeModels);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSphereLight);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSphereLights);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSpotLight);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSpotLights);
SE_DECLARE_FUNC(js_scene_RenderScene_unsetMainLight);
SE_DECLARE_FUNC(js_scene_RenderScene_update);
SE_DECLARE_FUNC(js_scene_RenderScene_updateOctree);
SE_DECLARE_FUNC(js_scene_RenderScene_RenderScene);

extern se::Object *__jsb_cc_scene_IRenderWindowInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_IRenderWindowInfo_class; // NOLINT

bool js_register_cc_scene_IRenderWindowInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::scene::IRenderWindowInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_scene_RenderWindow_proto; // NOLINT
extern se::Class * __jsb_cc_scene_RenderWindow_class; // NOLINT

bool js_register_cc_scene_RenderWindow(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_RenderWindow_attachCamera);
SE_DECLARE_FUNC(js_scene_RenderWindow_clearCameras);
SE_DECLARE_FUNC(js_scene_RenderWindow_destroy);
SE_DECLARE_FUNC(js_scene_RenderWindow_detachCamera);
SE_DECLARE_FUNC(js_scene_RenderWindow_extractRenderCameras);
SE_DECLARE_FUNC(js_scene_RenderWindow_initialize);
SE_DECLARE_FUNC(js_scene_RenderWindow_resize);
SE_DECLARE_FUNC(js_scene_RenderWindow_sortCameras);
SE_DECLARE_FUNC(js_scene_RenderWindow_RenderWindow);

extern se::Object *__jsb_cc_scene_SphereLight_proto; // NOLINT
extern se::Class * __jsb_cc_scene_SphereLight_class; // NOLINT

bool js_register_cc_scene_SphereLight(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_SphereLight_SphereLight);

extern se::Object *__jsb_cc_Root_proto; // NOLINT
extern se::Class * __jsb_cc_Root_class; // NOLINT

bool js_register_cc_Root(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Root_activeWindow);
SE_DECLARE_FUNC(js_scene_Root_createCamera);
SE_DECLARE_FUNC(js_scene_Root_createScene);
SE_DECLARE_FUNC(js_scene_Root_createWindow);
SE_DECLARE_FUNC(js_scene_Root_destroy);
SE_DECLARE_FUNC(js_scene_Root_destroyLight);
SE_DECLARE_FUNC(js_scene_Root_destroyModel);
SE_DECLARE_FUNC(js_scene_Root_destroyScene);
SE_DECLARE_FUNC(js_scene_Root_destroyScenes);
SE_DECLARE_FUNC(js_scene_Root_destroyWindow);
SE_DECLARE_FUNC(js_scene_Root_destroyWindows);
SE_DECLARE_FUNC(js_scene_Root_frameMove);
SE_DECLARE_FUNC(js_scene_Root_getBatcher2D);
SE_DECLARE_FUNC(js_scene_Root_getEventProcessor);
SE_DECLARE_FUNC(js_scene_Root_getPipeline);
SE_DECLARE_FUNC(js_scene_Root_initialize);
SE_DECLARE_FUNC(js_scene_Root_onGlobalPipelineStateChanged);
SE_DECLARE_FUNC(js_scene_Root_resetCumulativeTime);
SE_DECLARE_FUNC(js_scene_Root_resize);
SE_DECLARE_FUNC(js_scene_Root_setRenderPipeline);
SE_DECLARE_FUNC(js_scene_Root_getInstance);
SE_DECLARE_FUNC(js_scene_Root_Root);

extern se::Object *__jsb_cc_scene_SkyboxInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_SkyboxInfo_class; // NOLINT

bool js_register_cc_scene_SkyboxInfo(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_SkyboxInfo_activate);
SE_DECLARE_FUNC(js_scene_SkyboxInfo_getDiffuseMap);
SE_DECLARE_FUNC(js_scene_SkyboxInfo_setDiffuseMap);
SE_DECLARE_FUNC(js_scene_SkyboxInfo_SkyboxInfo);

extern se::Object *__jsb_cc_scene_Skybox_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Skybox_class; // NOLINT

bool js_register_cc_scene_Skybox(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Skybox_activate);
SE_DECLARE_FUNC(js_scene_Skybox_getDiffuseMap);
SE_DECLARE_FUNC(js_scene_Skybox_initialize);
SE_DECLARE_FUNC(js_scene_Skybox_isUseDiffuseMap);
SE_DECLARE_FUNC(js_scene_Skybox_isUseHDR);
SE_DECLARE_FUNC(js_scene_Skybox_setDiffuseMap);
SE_DECLARE_FUNC(js_scene_Skybox_setDiffuseMaps);
SE_DECLARE_FUNC(js_scene_Skybox_setEnvMaps);
SE_DECLARE_FUNC(js_scene_Skybox_setUseDiffuseMap);
SE_DECLARE_FUNC(js_scene_Skybox_setUseHDR);
SE_DECLARE_FUNC(js_scene_Skybox_Skybox);

extern se::Object *__jsb_cc_scene_Ambient_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Ambient_class; // NOLINT

bool js_register_cc_scene_Ambient(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Ambient_initialize);
SE_DECLARE_FUNC(js_scene_Ambient_Ambient);

extern se::Object *__jsb_cc_scene_AmbientInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_AmbientInfo_class; // NOLINT

bool js_register_cc_scene_AmbientInfo(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_AmbientInfo_getGroundAlbedoLDR);
SE_DECLARE_FUNC(js_scene_AmbientInfo_getGroundLightingColor);
SE_DECLARE_FUNC(js_scene_AmbientInfo_getSkyColorLDR);
SE_DECLARE_FUNC(js_scene_AmbientInfo_getSkyIllumLDR);
SE_DECLARE_FUNC(js_scene_AmbientInfo_getSkyLightingColor);
SE_DECLARE_FUNC(js_scene_AmbientInfo_setGroundLightingColor);
SE_DECLARE_FUNC(js_scene_AmbientInfo_setSkyLightingColor);
SE_DECLARE_FUNC(js_scene_AmbientInfo_AmbientInfo);

extern se::Object *__jsb_cc_scene_DirectionalLight_proto; // NOLINT
extern se::Class * __jsb_cc_scene_DirectionalLight_class; // NOLINT

bool js_register_cc_scene_DirectionalLight(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowBias);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowDistance);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowEnabled);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowFar);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowFixedArea);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowInvisibleOcclusionRange);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowNear);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowNormalBias);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowOrthoSize);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowPcf);
SE_DECLARE_FUNC(js_scene_DirectionalLight_getShadowSaturation);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowBias);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowDistance);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowEnabled);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowFar);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowFixedArea);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowInvisibleOcclusionRange);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowNear);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowNormalBias);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowOrthoSize);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowPcf);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setShadowSaturation);
SE_DECLARE_FUNC(js_scene_DirectionalLight_DirectionalLight);

extern se::Object *__jsb_cc_scene_SpotLight_proto; // NOLINT
extern se::Class * __jsb_cc_scene_SpotLight_class; // NOLINT

bool js_register_cc_scene_SpotLight(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_SpotLight_getShadowBias);
SE_DECLARE_FUNC(js_scene_SpotLight_getShadowEnabled);
SE_DECLARE_FUNC(js_scene_SpotLight_getShadowNormalBias);
SE_DECLARE_FUNC(js_scene_SpotLight_getShadowPcf);
SE_DECLARE_FUNC(js_scene_SpotLight_setShadowBias);
SE_DECLARE_FUNC(js_scene_SpotLight_setShadowEnabled);
SE_DECLARE_FUNC(js_scene_SpotLight_setShadowNormalBias);
SE_DECLARE_FUNC(js_scene_SpotLight_setShadowPcf);
SE_DECLARE_FUNC(js_scene_SpotLight_SpotLight);

extern se::Object *__jsb_cc_scene_PassDynamicsValue_proto; // NOLINT
extern se::Class * __jsb_cc_scene_PassDynamicsValue_class; // NOLINT

bool js_register_cc_scene_PassDynamicsValue(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::scene::PassDynamicsValue *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_scene_Pass_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Pass_class; // NOLINT

bool js_register_cc_scene_Pass(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Pass_beginChangeStatesSilently);
SE_DECLARE_FUNC(js_scene_Pass_bindSampler);
SE_DECLARE_FUNC(js_scene_Pass_bindTexture);
SE_DECLARE_FUNC(js_scene_Pass_destroy);
SE_DECLARE_FUNC(js_scene_Pass_endChangeStatesSilently);
SE_DECLARE_FUNC(js_scene_Pass_getBatchedBuffer);
SE_DECLARE_FUNC(js_scene_Pass_getBinding);
SE_DECLARE_FUNC(js_scene_Pass_getHandle);
SE_DECLARE_FUNC(js_scene_Pass_getHash);
SE_DECLARE_FUNC(js_scene_Pass_getInstancedBuffer);
SE_DECLARE_FUNC(js_scene_Pass_getPassInfoFull);
SE_DECLARE_FUNC(js_scene_Pass_getRootBlock);
SE_DECLARE_FUNC(js_scene_Pass_getShaderVariant);
SE_DECLARE_FUNC(js_scene_Pass_getUniform);
SE_DECLARE_FUNC(js_scene_Pass_initPassFromTarget);
SE_DECLARE_FUNC(js_scene_Pass_initialize);
SE_DECLARE_FUNC(js_scene_Pass_overridePipelineStates);
SE_DECLARE_FUNC(js_scene_Pass_resetTexture);
SE_DECLARE_FUNC(js_scene_Pass_resetTextures);
SE_DECLARE_FUNC(js_scene_Pass_resetUBOs);
SE_DECLARE_FUNC(js_scene_Pass_resetUniform);
SE_DECLARE_FUNC(js_scene_Pass_setDynamicState);
SE_DECLARE_FUNC(js_scene_Pass_setUniform);
SE_DECLARE_FUNC(js_scene_Pass_setUniformArray);
SE_DECLARE_FUNC(js_scene_Pass_tryCompile);
SE_DECLARE_FUNC(js_scene_Pass_update);
SE_DECLARE_FUNC(js_scene_Pass_fillPipelineInfo);
SE_DECLARE_FUNC(js_scene_Pass_getBindingFromHandle);
SE_DECLARE_FUNC(js_scene_Pass_getCountFromHandle);
SE_DECLARE_FUNC(js_scene_Pass_getOffsetFromHandle);
SE_DECLARE_FUNC(js_scene_Pass_getPassHash);
SE_DECLARE_FUNC(js_scene_Pass_getTypeFromHandle);
SE_DECLARE_FUNC(js_scene_Pass_Pass);

extern se::Object *__jsb_cc_scene_DrawBatch2D_proto; // NOLINT
extern se::Class * __jsb_cc_scene_DrawBatch2D_class; // NOLINT

bool js_register_cc_scene_DrawBatch2D(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::scene::DrawBatch2D *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_scene_ICameraInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_ICameraInfo_class; // NOLINT

bool js_register_cc_scene_ICameraInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::scene::ICameraInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_scene_Camera_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Camera_class; // NOLINT

bool js_register_cc_scene_Camera(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Camera_attachToScene);
SE_DECLARE_FUNC(js_scene_Camera_changeTargetWindow);
SE_DECLARE_FUNC(js_scene_Camera_destroy);
SE_DECLARE_FUNC(js_scene_Camera_detachCamera);
SE_DECLARE_FUNC(js_scene_Camera_detachFromScene);
SE_DECLARE_FUNC(js_scene_Camera_initialize);
SE_DECLARE_FUNC(js_scene_Camera_resize);
SE_DECLARE_FUNC(js_scene_Camera_setFixedSize);
SE_DECLARE_FUNC(js_scene_Camera_setViewportInOrientedSpace);
SE_DECLARE_FUNC(js_scene_Camera_update);
SE_DECLARE_FUNC(js_scene_Camera_getStandardExposureValue);
SE_DECLARE_FUNC(js_scene_Camera_getStandardLightMeterScale);
SE_DECLARE_FUNC(js_scene_Camera_Camera);

extern se::Object *__jsb_cc_PassInstance_proto; // NOLINT
extern se::Class * __jsb_cc_PassInstance_class; // NOLINT

bool js_register_cc_PassInstance(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_PassInstance_PassInstance);

extern se::Object *__jsb_cc_IMaterialInstanceInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IMaterialInstanceInfo_class; // NOLINT

bool js_register_cc_IMaterialInstanceInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IMaterialInstanceInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_MaterialInstance_proto; // NOLINT
extern se::Class * __jsb_cc_MaterialInstance_class; // NOLINT

bool js_register_cc_MaterialInstance(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_MaterialInstance_onPassStateChange);
SE_DECLARE_FUNC(js_scene_MaterialInstance_setRebuildPSOCallback);
SE_DECLARE_FUNC(js_scene_MaterialInstance_MaterialInstance);

extern se::Object *__jsb_cc_MorphModel_proto; // NOLINT
extern se::Class * __jsb_cc_MorphModel_class; // NOLINT

bool js_register_cc_MorphModel(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_MorphModel_setMorphRendering);
SE_DECLARE_FUNC(js_scene_MorphModel_MorphModel);

extern se::Object *__jsb_cc_SkinningModel_proto; // NOLINT
extern se::Class * __jsb_cc_SkinningModel_class; // NOLINT

bool js_register_cc_SkinningModel(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_SkinningModel_bindSkeleton);
SE_DECLARE_FUNC(js_scene_SkinningModel_SkinningModel);

extern se::Object *__jsb_cc_BakedSkinningModel_proto; // NOLINT
extern se::Class * __jsb_cc_BakedSkinningModel_class; // NOLINT

bool js_register_cc_BakedSkinningModel(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_BakedSkinningModel_bindSkeleton);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_setUploadedAnimForJS);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_syncAnimInfoForJS);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_syncDataForJS);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_BakedSkinningModel);

extern se::Object *__jsb_cc_IDefineRecord_proto; // NOLINT
extern se::Class * __jsb_cc_IDefineRecord_class; // NOLINT

bool js_register_cc_IDefineRecord(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IDefineRecord *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IProgramInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IProgramInfo_class; // NOLINT

bool js_register_cc_IProgramInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IProgramInfo *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_scene_IProgramInfo_copyFrom);

extern se::Object *__jsb_cc_ProgramLib_proto; // NOLINT
extern se::Class * __jsb_cc_ProgramLib_class; // NOLINT

bool js_register_cc_ProgramLib(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_ProgramLib_define);
SE_DECLARE_FUNC(js_scene_ProgramLib_destroyShaderByDefines);
SE_DECLARE_FUNC(js_scene_ProgramLib_getDescriptorSetLayout);
SE_DECLARE_FUNC(js_scene_ProgramLib_getGFXShader);
SE_DECLARE_FUNC(js_scene_ProgramLib_getKey);
SE_DECLARE_FUNC(js_scene_ProgramLib_getTemplate);
SE_DECLARE_FUNC(js_scene_ProgramLib_getTemplateInfo);
SE_DECLARE_FUNC(js_scene_ProgramLib_hasProgram);
SE_DECLARE_FUNC(js_scene_ProgramLib_registerEffect);
SE_DECLARE_FUNC(js_scene_ProgramLib_destroyInstance);
SE_DECLARE_FUNC(js_scene_ProgramLib_getInstance);

extern se::Object *__jsb_cc_scene_OctreeInfo_proto; // NOLINT
extern se::Class * __jsb_cc_scene_OctreeInfo_class; // NOLINT

bool js_register_cc_scene_OctreeInfo(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_OctreeInfo_activate);
SE_DECLARE_FUNC(js_scene_OctreeInfo_OctreeInfo);

extern se::Object *__jsb_cc_scene_Octree_proto; // NOLINT
extern se::Class * __jsb_cc_scene_Octree_class; // NOLINT

bool js_register_cc_scene_Octree(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_scene_Octree_getMaxDepth);
SE_DECLARE_FUNC(js_scene_Octree_getMaxPos);
SE_DECLARE_FUNC(js_scene_Octree_getMinPos);
SE_DECLARE_FUNC(js_scene_Octree_initialize);
SE_DECLARE_FUNC(js_scene_Octree_insert);
SE_DECLARE_FUNC(js_scene_Octree_isEnabled);
SE_DECLARE_FUNC(js_scene_Octree_queryVisibility);
SE_DECLARE_FUNC(js_scene_Octree_remove);
SE_DECLARE_FUNC(js_scene_Octree_resize);
SE_DECLARE_FUNC(js_scene_Octree_setEnabled);
SE_DECLARE_FUNC(js_scene_Octree_setMaxDepth);
SE_DECLARE_FUNC(js_scene_Octree_setMaxPos);
SE_DECLARE_FUNC(js_scene_Octree_setMinPos);
SE_DECLARE_FUNC(js_scene_Octree_update);
SE_DECLARE_FUNC(js_scene_Octree_Octree);
    // clang-format on