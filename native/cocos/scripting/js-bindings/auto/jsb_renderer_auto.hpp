#pragma once
#include "base/ccConfig.h"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_renderer_ProgramLib_proto;
extern se::Class* __jsb_cocos2d_renderer_ProgramLib_class;

bool js_register_cocos2d_renderer_ProgramLib(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_ProgramLib_define);
SE_DECLARE_FUNC(js_renderer_ProgramLib_ProgramLib);

extern se::Object* __jsb_cocos2d_renderer_CustomProperties_proto;
extern se::Class* __jsb_cocos2d_renderer_CustomProperties_class;

bool js_register_cocos2d_renderer_CustomProperties(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_CustomProperties_define);
SE_DECLARE_FUNC(js_renderer_CustomProperties_CustomProperties);

extern se::Object* __jsb_cocos2d_renderer_Pass_proto;
extern se::Class* __jsb_cocos2d_renderer_Pass_class;

bool js_register_cocos2d_renderer_Pass(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_Pass_getStencilTest);
SE_DECLARE_FUNC(js_renderer_Pass_setStencilBack);
SE_DECLARE_FUNC(js_renderer_Pass_getProgramName);
SE_DECLARE_FUNC(js_renderer_Pass_setCullMode);
SE_DECLARE_FUNC(js_renderer_Pass_setBlend);
SE_DECLARE_FUNC(js_renderer_Pass_setProgramName);
SE_DECLARE_FUNC(js_renderer_Pass_disableStencilTest);
SE_DECLARE_FUNC(js_renderer_Pass_setStencilFront);
SE_DECLARE_FUNC(js_renderer_Pass_setDepth);
SE_DECLARE_FUNC(js_renderer_Pass_Pass);

extern se::Object* __jsb_cocos2d_renderer_Effect_proto;
extern se::Class* __jsb_cocos2d_renderer_Effect_class;

bool js_register_cocos2d_renderer_Effect(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_Effect_getProperty);
SE_DECLARE_FUNC(js_renderer_Effect_setStencilTest);
SE_DECLARE_FUNC(js_renderer_Effect_getTechnique);
SE_DECLARE_FUNC(js_renderer_Effect_getDefine);
SE_DECLARE_FUNC(js_renderer_Effect_setCullMode);
SE_DECLARE_FUNC(js_renderer_Effect_setStencil);
SE_DECLARE_FUNC(js_renderer_Effect_setBlend);
SE_DECLARE_FUNC(js_renderer_Effect_getHash);
SE_DECLARE_FUNC(js_renderer_Effect_updateHash);
SE_DECLARE_FUNC(js_renderer_Effect_copy);
SE_DECLARE_FUNC(js_renderer_Effect_clear);
SE_DECLARE_FUNC(js_renderer_Effect_define);
SE_DECLARE_FUNC(js_renderer_Effect_Effect);

extern se::Object* __jsb_cocos2d_renderer_AssemblerBase_proto;
extern se::Class* __jsb_cocos2d_renderer_AssemblerBase_class;

bool js_register_cocos2d_renderer_AssemblerBase(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_AssemblerBase_disableDirty);
SE_DECLARE_FUNC(js_renderer_AssemblerBase_reset);
SE_DECLARE_FUNC(js_renderer_AssemblerBase_setUseModel);
SE_DECLARE_FUNC(js_renderer_AssemblerBase_isDirty);
SE_DECLARE_FUNC(js_renderer_AssemblerBase_setDirty);
SE_DECLARE_FUNC(js_renderer_AssemblerBase_AssemblerBase);

extern se::Object* __jsb_cocos2d_renderer_MemPool_proto;
extern se::Class* __jsb_cocos2d_renderer_MemPool_class;

bool js_register_cocos2d_renderer_MemPool(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_MemPool_removeCommonData);
SE_DECLARE_FUNC(js_renderer_MemPool_updateCommonData);
SE_DECLARE_FUNC(js_renderer_MemPool_MemPool);

extern se::Object* __jsb_cocos2d_renderer_NodeProxy_proto;
extern se::Class* __jsb_cocos2d_renderer_NodeProxy_class;

bool js_register_cocos2d_renderer_NodeProxy(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_NodeProxy_disableVisit);
SE_DECLARE_FUNC(js_renderer_NodeProxy_notifyUpdateParent);
SE_DECLARE_FUNC(js_renderer_NodeProxy_destroyImmediately);
SE_DECLARE_FUNC(js_renderer_NodeProxy_enableVisit);
SE_DECLARE_FUNC(js_renderer_NodeProxy_setName);
SE_DECLARE_FUNC(js_renderer_NodeProxy_clearAssembler);
SE_DECLARE_FUNC(js_renderer_NodeProxy_setAssembler);
SE_DECLARE_FUNC(js_renderer_NodeProxy_NodeProxy);

extern se::Object* __jsb_cocos2d_renderer_BaseRenderer_proto;
extern se::Class* __jsb_cocos2d_renderer_BaseRenderer_class;

bool js_register_cocos2d_renderer_BaseRenderer(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_BaseRenderer_getProgramLib);
SE_DECLARE_FUNC(js_renderer_BaseRenderer_init);
SE_DECLARE_FUNC(js_renderer_BaseRenderer_BaseRenderer);

extern se::Object* __jsb_cocos2d_renderer_View_proto;
extern se::Class* __jsb_cocos2d_renderer_View_class;

bool js_register_cocos2d_renderer_View(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_View_View);

extern se::Object* __jsb_cocos2d_renderer_Camera_proto;
extern se::Class* __jsb_cocos2d_renderer_Camera_class;

bool js_register_cocos2d_renderer_Camera(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_Camera_getDepth);
SE_DECLARE_FUNC(js_renderer_Camera_setFov);
SE_DECLARE_FUNC(js_renderer_Camera_getFrameBuffer);
SE_DECLARE_FUNC(js_renderer_Camera_setStencil);
SE_DECLARE_FUNC(js_renderer_Camera_setPriority);
SE_DECLARE_FUNC(js_renderer_Camera_getOrthoHeight);
SE_DECLARE_FUNC(js_renderer_Camera_setCullingMask);
SE_DECLARE_FUNC(js_renderer_Camera_getStencil);
SE_DECLARE_FUNC(js_renderer_Camera_setType);
SE_DECLARE_FUNC(js_renderer_Camera_getPriority);
SE_DECLARE_FUNC(js_renderer_Camera_setFar);
SE_DECLARE_FUNC(js_renderer_Camera_setFrameBuffer);
SE_DECLARE_FUNC(js_renderer_Camera_setRect);
SE_DECLARE_FUNC(js_renderer_Camera_setClearFlags);
SE_DECLARE_FUNC(js_renderer_Camera_getFar);
SE_DECLARE_FUNC(js_renderer_Camera_getType);
SE_DECLARE_FUNC(js_renderer_Camera_getCullingMask);
SE_DECLARE_FUNC(js_renderer_Camera_setNear);
SE_DECLARE_FUNC(js_renderer_Camera_setStages);
SE_DECLARE_FUNC(js_renderer_Camera_setOrthoHeight);
SE_DECLARE_FUNC(js_renderer_Camera_setDepth);
SE_DECLARE_FUNC(js_renderer_Camera_getStages);
SE_DECLARE_FUNC(js_renderer_Camera_getFov);
SE_DECLARE_FUNC(js_renderer_Camera_setColor);
SE_DECLARE_FUNC(js_renderer_Camera_setWorldMatrix);
SE_DECLARE_FUNC(js_renderer_Camera_getNear);
SE_DECLARE_FUNC(js_renderer_Camera_getClearFlags);
SE_DECLARE_FUNC(js_renderer_Camera_Camera);

extern se::Object* __jsb_cocos2d_renderer_ForwardRenderer_proto;
extern se::Class* __jsb_cocos2d_renderer_ForwardRenderer_class;

bool js_register_cocos2d_renderer_ForwardRenderer(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_ForwardRenderer_renderCamera);
SE_DECLARE_FUNC(js_renderer_ForwardRenderer_init);
SE_DECLARE_FUNC(js_renderer_ForwardRenderer_render);
SE_DECLARE_FUNC(js_renderer_ForwardRenderer_ForwardRenderer);

extern se::Object* __jsb_cocos2d_renderer_Light_proto;
extern se::Class* __jsb_cocos2d_renderer_Light_class;

bool js_register_cocos2d_renderer_Light(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_Light_getRange);
SE_DECLARE_FUNC(js_renderer_Light_setShadowFrustumSize);
SE_DECLARE_FUNC(js_renderer_Light_setShadowResolution);
SE_DECLARE_FUNC(js_renderer_Light_getFrustumEdgeFalloff);
SE_DECLARE_FUNC(js_renderer_Light_setSpotExp);
SE_DECLARE_FUNC(js_renderer_Light_setShadowType);
SE_DECLARE_FUNC(js_renderer_Light_setType);
SE_DECLARE_FUNC(js_renderer_Light_getViewProjMatrix);
SE_DECLARE_FUNC(js_renderer_Light_getPositionUniform);
SE_DECLARE_FUNC(js_renderer_Light_getShadowBias);
SE_DECLARE_FUNC(js_renderer_Light_getShadowDarkness);
SE_DECLARE_FUNC(js_renderer_Light_getSpotAngle);
SE_DECLARE_FUNC(js_renderer_Light_getDirectionUniform);
SE_DECLARE_FUNC(js_renderer_Light_getSpotExp);
SE_DECLARE_FUNC(js_renderer_Light_setShadowDepthScale);
SE_DECLARE_FUNC(js_renderer_Light_getViewPorjMatrix);
SE_DECLARE_FUNC(js_renderer_Light_getType);
SE_DECLARE_FUNC(js_renderer_Light_getColorUniform);
SE_DECLARE_FUNC(js_renderer_Light_getIntensity);
SE_DECLARE_FUNC(js_renderer_Light_getShadowMaxDepth);
SE_DECLARE_FUNC(js_renderer_Light_getWorldMatrix);
SE_DECLARE_FUNC(js_renderer_Light_getShadowMap);
SE_DECLARE_FUNC(js_renderer_Light_getColor);
SE_DECLARE_FUNC(js_renderer_Light_setIntensity);
SE_DECLARE_FUNC(js_renderer_Light_getShadowMinDepth);
SE_DECLARE_FUNC(js_renderer_Light_setShadowMinDepth);
SE_DECLARE_FUNC(js_renderer_Light_update);
SE_DECLARE_FUNC(js_renderer_Light_setShadowDarkness);
SE_DECLARE_FUNC(js_renderer_Light_setWorldMatrix);
SE_DECLARE_FUNC(js_renderer_Light_setSpotAngle);
SE_DECLARE_FUNC(js_renderer_Light_setRange);
SE_DECLARE_FUNC(js_renderer_Light_setColor);
SE_DECLARE_FUNC(js_renderer_Light_setShadowMaxDepth);
SE_DECLARE_FUNC(js_renderer_Light_setFrustumEdgeFalloff);
SE_DECLARE_FUNC(js_renderer_Light_getShadowResolution);
SE_DECLARE_FUNC(js_renderer_Light_getShadowDepthScale);
SE_DECLARE_FUNC(js_renderer_Light_getShadowType);
SE_DECLARE_FUNC(js_renderer_Light_setShadowBias);
SE_DECLARE_FUNC(js_renderer_Light_Light);

extern se::Object* __jsb_cocos2d_renderer_Scene_proto;
extern se::Class* __jsb_cocos2d_renderer_Scene_class;

bool js_register_cocos2d_renderer_Scene(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_Scene_getCameraCount);
SE_DECLARE_FUNC(js_renderer_Scene_removeCamera);
SE_DECLARE_FUNC(js_renderer_Scene_getLightCount);
SE_DECLARE_FUNC(js_renderer_Scene_removeView);
SE_DECLARE_FUNC(js_renderer_Scene_getLights);
SE_DECLARE_FUNC(js_renderer_Scene_removeLight);
SE_DECLARE_FUNC(js_renderer_Scene_addCamera);
SE_DECLARE_FUNC(js_renderer_Scene_getLight);
SE_DECLARE_FUNC(js_renderer_Scene_addLight);
SE_DECLARE_FUNC(js_renderer_Scene_getCameras);
SE_DECLARE_FUNC(js_renderer_Scene_sortCameras);
SE_DECLARE_FUNC(js_renderer_Scene_setDebugCamera);
SE_DECLARE_FUNC(js_renderer_Scene_reset);
SE_DECLARE_FUNC(js_renderer_Scene_getCamera);
SE_DECLARE_FUNC(js_renderer_Scene_addView);
SE_DECLARE_FUNC(js_renderer_Scene_Scene);

extern se::Object* __jsb_cocos2d_renderer_NodeMemPool_proto;
extern se::Class* __jsb_cocos2d_renderer_NodeMemPool_class;

bool js_register_cocos2d_renderer_NodeMemPool(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_NodeMemPool_removeNodeData);
SE_DECLARE_FUNC(js_renderer_NodeMemPool_updateNodeData);
SE_DECLARE_FUNC(js_renderer_NodeMemPool_NodeMemPool);

extern se::Object* __jsb_cocos2d_renderer_RenderDataList_proto;
extern se::Class* __jsb_cocos2d_renderer_RenderDataList_class;

bool js_register_cocos2d_renderer_RenderDataList(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_RenderDataList_updateMesh);
SE_DECLARE_FUNC(js_renderer_RenderDataList_clear);
SE_DECLARE_FUNC(js_renderer_RenderDataList_RenderDataList);

extern se::Object* __jsb_cocos2d_renderer_Assembler_proto;
extern se::Class* __jsb_cocos2d_renderer_Assembler_class;

bool js_register_cocos2d_renderer_Assembler(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_Assembler_setVertexFormat);
SE_DECLARE_FUNC(js_renderer_Assembler_isIgnoreOpacityFlag);
SE_DECLARE_FUNC(js_renderer_Assembler_ignoreWorldMatrix);
SE_DECLARE_FUNC(js_renderer_Assembler_updateVerticesRange);
SE_DECLARE_FUNC(js_renderer_Assembler_setRenderDataList);
SE_DECLARE_FUNC(js_renderer_Assembler_updateMeshIndex);
SE_DECLARE_FUNC(js_renderer_Assembler_updateEffect);
SE_DECLARE_FUNC(js_renderer_Assembler_getCustomProperties);
SE_DECLARE_FUNC(js_renderer_Assembler_updateIndicesRange);
SE_DECLARE_FUNC(js_renderer_Assembler_ignoreOpacityFlag);
SE_DECLARE_FUNC(js_renderer_Assembler_setCustomProperties);
SE_DECLARE_FUNC(js_renderer_Assembler_Assembler);

extern se::Object* __jsb_cocos2d_renderer_CustomAssembler_proto;
extern se::Class* __jsb_cocos2d_renderer_CustomAssembler_class;

bool js_register_cocos2d_renderer_CustomAssembler(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_CustomAssembler_clearEffect);
SE_DECLARE_FUNC(js_renderer_CustomAssembler_updateEffect);
SE_DECLARE_FUNC(js_renderer_CustomAssembler_updateIABuffer);
SE_DECLARE_FUNC(js_renderer_CustomAssembler_CustomAssembler);

extern se::Object* __jsb_cocos2d_renderer_RenderFlow_proto;
extern se::Class* __jsb_cocos2d_renderer_RenderFlow_class;

bool js_register_cocos2d_renderer_RenderFlow(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_RenderFlow_render);
SE_DECLARE_FUNC(js_renderer_RenderFlow_RenderFlow);

extern se::Object* __jsb_cocos2d_renderer_AssemblerSprite_proto;
extern se::Class* __jsb_cocos2d_renderer_AssemblerSprite_class;

bool js_register_cocos2d_renderer_AssemblerSprite(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_AssemblerSprite_setLocalData);

extern se::Object* __jsb_cocos2d_renderer_SimpleSprite2D_proto;
extern se::Class* __jsb_cocos2d_renderer_SimpleSprite2D_class;

bool js_register_cocos2d_renderer_SimpleSprite2D(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_SimpleSprite2D_SimpleSprite2D);

extern se::Object* __jsb_cocos2d_renderer_MaskAssembler_proto;
extern se::Class* __jsb_cocos2d_renderer_MaskAssembler_class;

bool js_register_cocos2d_renderer_MaskAssembler(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_MaskAssembler_setMaskInverted);
SE_DECLARE_FUNC(js_renderer_MaskAssembler_setImageStencil);
SE_DECLARE_FUNC(js_renderer_MaskAssembler_setClearSubHandle);
SE_DECLARE_FUNC(js_renderer_MaskAssembler_getMaskInverted);
SE_DECLARE_FUNC(js_renderer_MaskAssembler_setRenderSubHandle);
SE_DECLARE_FUNC(js_renderer_MaskAssembler_MaskAssembler);

extern se::Object* __jsb_cocos2d_renderer_TiledMapAssembler_proto;
extern se::Class* __jsb_cocos2d_renderer_TiledMapAssembler_class;

bool js_register_cocos2d_renderer_TiledMapAssembler(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_TiledMapAssembler_updateNodes);
SE_DECLARE_FUNC(js_renderer_TiledMapAssembler_clearNodes);
SE_DECLARE_FUNC(js_renderer_TiledMapAssembler_TiledMapAssembler);

extern se::Object* __jsb_cocos2d_renderer_SlicedSprite2D_proto;
extern se::Class* __jsb_cocos2d_renderer_SlicedSprite2D_class;

bool js_register_cocos2d_renderer_SlicedSprite2D(se::Object* obj);
bool register_all_renderer(se::Object* obj);
SE_DECLARE_FUNC(js_renderer_SlicedSprite2D_SlicedSprite2D);

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
