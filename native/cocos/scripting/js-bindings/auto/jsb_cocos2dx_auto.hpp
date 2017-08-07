#include "base/ccConfig.h"
#ifndef __cocos2dx_h__
#define __cocos2dx_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_cocos2d_Acceleration_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Acceleration_prototype;

bool js_cocos2dx_Acceleration_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Acceleration_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Acceleration(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Acceleration_Acceleration(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Texture2D_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Texture2D_prototype;

bool js_cocos2dx_Texture2D_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Texture2D_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Texture2D(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Texture2D_getGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getMaxT(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_setAlphaTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getStringForFormat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_initWithImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_setGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getMaxS(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_hasPremultipliedAlpha(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getPixelsHigh(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getAlphaTextureName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getBitsPerPixelForFormat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_initWithString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_setMaxT(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getPath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_drawInRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getContentSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_setAliasTexParameters(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_setAntiAliasTexParameters(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_generateMipmap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getDescription(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getPixelFormat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getContentSizeInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_releaseGLTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getPixelsWide(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_drawAtPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_hasMipmaps(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_setMaxS(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_setDefaultAlphaPixelFormat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_getDefaultAlphaPixelFormat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Texture2D_Texture2D(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Touch_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Touch_prototype;

bool js_cocos2dx_Touch_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Touch_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Touch(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Touch_getPreviousLocationInView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getDelta(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getStartLocationInView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getCurrentForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getStartLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getID(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_setTouchInfo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getLocationInView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_getPreviousLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Touch_Touch(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Event_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Event_prototype;

bool js_cocos2dx_Event_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Event_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Event(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Event_isStopped(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Event_getType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Event_getCurrentTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Event_stopPropagation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Event_Event(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventTouch_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventTouch_prototype;

bool js_cocos2dx_EventTouch_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventTouch_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventTouch(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventTouch_getEventCode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventTouch_setEventCode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventTouch_EventTouch(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ComponentContainer_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ComponentContainer_prototype;

bool js_cocos2dx_ComponentContainer_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ComponentContainer_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ComponentContainer(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ComponentContainer_visit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ComponentContainer_remove(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ComponentContainer_removeAll(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ComponentContainer_add(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ComponentContainer_isEmpty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ComponentContainer_get(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Component_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Component_prototype;

bool js_cocos2dx_Component_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Component_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Component(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Component_setEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_setName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_isEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_getOwner(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_setOwner(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_getName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_Component(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Node_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Node_prototype;

bool js_cocos2dx_Node_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Node_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Node(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Node_addChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_removeComponent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getDescription(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setOpacityModifyRGB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setCascadeOpacityEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getChildren(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_markTransformUpdated(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setOnExitCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_isIgnoreAnchorPointForPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getChildByName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_updateDisplayedOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getCameraMask(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setRotation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setScaleZ(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setScaleY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setScaleX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setonEnterTransitionDidFinishCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_removeAllComponents(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node__setLocalZOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setCameraMask(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setAfterVisitCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getNodeToWorldAffineTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_removeChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getEventDispatcher(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setSkewX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setGLProgramState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setOnEnterCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_stopActionsByFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setNormalizedPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setonExitTransitionDidStartCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_convertTouchToNodeSpace(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_removeAllChildrenWithCleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getRotationSkewX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getRotationSkewY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getNodeToWorldTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_isCascadeOpacityEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setParent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getNodeToParentAffineTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_isOpacityModifyRGB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_stopActionByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_reorderChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setSkewY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setPositionY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setPositionX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setNodeToParentTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getAnchorPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getNumberOfRunningActions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_updateTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_isVisible(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getChildrenCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getNodeToParentTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_convertToNodeSpaceAR(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_addComponent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_runAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getRotation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getAnchorPointInPoints(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_visit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_removeChildByName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setPositionZ(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getGLProgramState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setScheduler(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_stopAllActions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getSkewX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getSkewY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_isScheduled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getDisplayedColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getActionByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setRotationSkewX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setRotationSkewY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getDisplayedOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getLocalZOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getScheduler(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setBeforeVisitCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setActionManager(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_insertChildBefore(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_isRunning(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getParent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getWorldToNodeTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getPositionY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getPositionX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_removeChildByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_updateDisplayedColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setVisible(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getParentToNodeAffineTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getPositionZ(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setGlobalZOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setScale(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getChildByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getScaleZ(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getScaleY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getScaleX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setLocalZOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setCascadeColorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getComponent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getContentSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_stopAllActionsByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getBoundingBox(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setIgnoreAnchorPointForPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setEventDispatcher(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getGlobalZOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_draw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setUserObject(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_enumerateChildren(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_removeFromParentAndCleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_convertTouchToNodeSpaceAR(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_update(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_sortAllChildren(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getWorldToNodeAffineTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getScale(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_updateOrderOfArrival(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getNormalizedPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getParentToNodeTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_convertToNodeSpace(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_setTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_isCascadeColorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_stopAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_getActionManager(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_Node(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Scene_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Scene_prototype;

bool js_cocos2dx_Scene_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Scene_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Scene(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Scene_initWithSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scene_render(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scene_createWithSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scene_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scene_Scene(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_GLView_class;
extern JS::PersistentRootedObject *jsb_cocos2d_GLView_prototype;

bool js_cocos2dx_GLView_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_GLView_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_GLView(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_GLView_setFrameSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getViewPortRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setContentScaleFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getContentScaleFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setIMEKeyboardState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_isAntiAliasEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setScissorInPoints(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getViewName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_isOpenGLReady(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setCursorVisible(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getScaleY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getScaleX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getVisibleOrigin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getFrameSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setFrameZoomFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getFrameZoomFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getDesignResolutionSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_windowShouldClose(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setDesignResolutionSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getResolutionPolicy(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_isRetinaDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_renderScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setViewPortInPoints(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getScissorRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_enableAntiAlias(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getRetinaFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setViewName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getVisibleRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_getVisibleSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_isScissorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_pollEvents(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLView_setGLContextAttrs(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Director_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Director_prototype;

bool js_cocos2dx_Director_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Director_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Director(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Director_pause(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_isPurgeDirectorInNextLoop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setEventDispatcher(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setContentScaleFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getContentScaleFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getWinSizeInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getDeltaTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setGLDefaultValues(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setActionManager(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setAlphaBlending(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_popToRootScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_loadMatrix(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getNotificationNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getWinSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_end(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getTextureCache(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_isSendCleanupToScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getVisibleOrigin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_mainLoop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setDepthTest(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getFrameRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getSecondsPerFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_resetMatrixStack(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_convertToUI(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_pushMatrix(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setDefaultValues(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setScheduler(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getMatrix(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_isValid(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_startAnimation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getOpenGLView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getRunningScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setViewport(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_stopAnimation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_popToSceneStackLevel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_resume(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_isNextDeltaTimeZero(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setClearColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setOpenGLView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_convertToGL(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_purgeCachedData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getTotalFrames(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_runWithScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setNotificationNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_drawScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_restart(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_popScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_loadIdentityMatrix(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_isDisplayStats(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setProjection(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_multiplyMatrix(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getZEye(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setNextDeltaTimeZero(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_popMatrix(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getVisibleSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getScheduler(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_pushScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getAnimationInterval(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_isPaused(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setDisplayStats(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getEventDispatcher(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_replaceScene(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_setAnimationInterval(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getActionManager(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Director_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Scheduler_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Scheduler_prototype;

bool js_cocos2dx_Scheduler_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Scheduler_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Scheduler(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Scheduler_setTimeScale(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_isCurrentTargetSalvaged(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_update(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_unscheduleScriptEntry(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_unscheduleAll(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_getTimeScale(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_unscheduleAllWithMinPriority(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_performFunctionInCocosThread(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_removeAllFunctionsToBePerformedInCocosThread(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Scheduler_Scheduler(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_AsyncTaskPool_class;
extern JS::PersistentRootedObject *jsb_cocos2d_AsyncTaskPool_prototype;

bool js_cocos2dx_AsyncTaskPool_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_AsyncTaskPool_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_AsyncTaskPool(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_AsyncTaskPool_stopTasks(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AsyncTaskPool_destroyInstance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AsyncTaskPool_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Configuration_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Configuration_prototype;

bool js_cocos2dx_Configuration_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Configuration_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Configuration(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Configuration_supportsPVRTC(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsOESDepth24(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getMaxModelviewStackDepth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsShareableVAO(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsBGRA8888(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_checkForGLExtension(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsNPOT(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getMaxSupportPointLightInShader(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getMaxTextureSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_setValue(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getMaxSupportSpotLightInShader(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsETC(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getMaxSupportDirLightInShader(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_loadConfigFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsDiscardFramebuffer(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsOESPackedDepthStencil(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getInfo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getMaxTextureUnits(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getValue(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_gatherGPUInfo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_supportsMapBuffer(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_destroyInstance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Configuration_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Properties_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Properties_prototype;

bool js_cocos2dx_Properties_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Properties_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Properties(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Properties_getVariable(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getLong(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getNamespace(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getPath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getMat4(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_exists(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_setString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getId(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_rewind(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_setVariable(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getBool(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getNextNamespace(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getInt(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getVec3(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getVec2(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getVec4(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getNextProperty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getFloat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_getQuaternionFromAxisAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_parseColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_parseVec3(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_parseAxisAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_parseVec2(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_createNonRefCounted(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Properties_parseVec4(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_FileUtils_class;
extern JS::PersistentRootedObject *jsb_cocos2d_FileUtils_prototype;

bool js_cocos2dx_FileUtils_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_FileUtils_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_FileUtils(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_FileUtils_fullPathForFilename(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getStringFromFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_removeFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_isAbsolutePath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_renameFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_loadFilenameLookupDictionaryFromFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_isPopupNotify(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getValueVectorFromFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getSearchPaths(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_writeToFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_listFiles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getValueMapFromFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getFileSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getValueMapFromData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_removeDirectory(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_setSearchPaths(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_writeStringToFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_setSearchResolutionsOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_addSearchResolutionsOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_addSearchPath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_writeValueVectorToFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_isFileExist(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_purgeCachedEntries(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_fullPathFromRelativeFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getSuitableFOpen(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_writeValueMapToFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getFileExtension(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_setWritablePath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_setPopupNotify(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_isDirectoryExist(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_setDefaultResourceRootPath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getSearchResolutionsOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_createDirectory(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_listFilesRecursively(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getWritablePath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_setDelegate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FileUtils_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventAcceleration_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventAcceleration_prototype;

bool js_cocos2dx_EventAcceleration_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventAcceleration_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventAcceleration(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventAcceleration_EventAcceleration(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventCustom_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventCustom_prototype;

bool js_cocos2dx_EventCustom_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventCustom_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventCustom(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventCustom_getEventName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventCustom_EventCustom(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListener_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListener_prototype;

bool js_cocos2dx_EventListener_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListener_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListener(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListener_setEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListener_isEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListener_clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListener_checkAvailable(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventDispatcher_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventDispatcher_prototype;

bool js_cocos2dx_EventDispatcher_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventDispatcher_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventDispatcher(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventDispatcher_setEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_removeAllEventListeners(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_addEventListenerWithSceneGraphPriority(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_addEventListenerWithFixedPriority(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_removeEventListenersForTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_resumeEventListenersForTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_setPriority(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_dispatchEvent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_hasEventListener(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_pauseEventListenersForTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_removeCustomEventListeners(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_removeEventListener(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_isEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventDispatcher_EventDispatcher(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventFocus_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventFocus_prototype;

bool js_cocos2dx_EventFocus_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventFocus_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventFocus(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventFocus_EventFocus(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListenerAcceleration_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerAcceleration_prototype;

bool js_cocos2dx_EventListenerAcceleration_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListenerAcceleration_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListenerAcceleration(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListenerAcceleration_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerAcceleration_EventListenerAcceleration(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListenerCustom_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerCustom_prototype;

bool js_cocos2dx_EventListenerCustom_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListenerCustom_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListenerCustom(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListenerCustom_EventListenerCustom(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListenerFocus_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerFocus_prototype;

bool js_cocos2dx_EventListenerFocus_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListenerFocus_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListenerFocus(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListenerFocus_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerFocus_EventListenerFocus(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListenerKeyboard_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerKeyboard_prototype;

bool js_cocos2dx_EventListenerKeyboard_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListenerKeyboard_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListenerKeyboard(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListenerKeyboard_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerKeyboard_EventListenerKeyboard(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventMouse_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventMouse_prototype;

bool js_cocos2dx_EventMouse_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventMouse_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventMouse(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventMouse_getMouseButton(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_setMouseButton(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_setScrollData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getPreviousLocationInView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getDelta(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getStartLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getCursorY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getCursorX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getLocationInView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getScrollY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_setCursorPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getScrollX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getPreviousLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_getStartLocationInView(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventMouse_EventMouse(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListenerMouse_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerMouse_prototype;

bool js_cocos2dx_EventListenerMouse_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListenerMouse_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListenerMouse(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListenerMouse_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerMouse_EventListenerMouse(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListenerTouchOneByOne_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerTouchOneByOne_prototype;

bool js_cocos2dx_EventListenerTouchOneByOne_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListenerTouchOneByOne_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListenerTouchOneByOne(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListenerTouchOneByOne_isSwallowTouches(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerTouchOneByOne_setSwallowTouches(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerTouchOneByOne_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerTouchOneByOne_EventListenerTouchOneByOne(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EventListenerTouchAllAtOnce_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerTouchAllAtOnce_prototype;

bool js_cocos2dx_EventListenerTouchAllAtOnce_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EventListenerTouchAllAtOnce_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EventListenerTouchAllAtOnce(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EventListenerTouchAllAtOnce_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EventListenerTouchAllAtOnce_EventListenerTouchAllAtOnce(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Action_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Action_prototype;

bool js_cocos2dx_Action_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Action_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Action(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Action_startWithTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_setOriginalTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_getOriginalTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_stop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_update(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_getTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_getFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_step(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_setTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_setFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_getTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_setTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_isDone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Action_reverse(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_FiniteTimeAction_class;
extern JS::PersistentRootedObject *jsb_cocos2d_FiniteTimeAction_prototype;

bool js_cocos2dx_FiniteTimeAction_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_FiniteTimeAction_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_FiniteTimeAction(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_FiniteTimeAction_setDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FiniteTimeAction_getDuration(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Speed_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Speed_prototype;

bool js_cocos2dx_Speed_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Speed_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Speed(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Speed_setInnerAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Speed_getSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Speed_setSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Speed_initWithAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Speed_getInnerAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Speed_Speed(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Image_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Image_prototype;

bool js_cocos2dx_Image_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Image_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Image(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Image_hasPremultipliedAlpha(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getDataLen(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_saveToFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_hasAlpha(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_isCompressed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_initWithImageFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getBitPerPixel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getFileType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getFilePath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getNumberOfMipmaps(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_getRenderFormat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_setPVRImagesHavePremultipliedAlpha(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_setPNGPremultipliedAlphaEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Image_Image(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_GLProgramState_class;
extern JS::PersistentRootedObject *jsb_cocos2d_GLProgramState_prototype;

bool js_cocos2dx_GLProgramState_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_GLProgramState_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_GLProgramState(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_GLProgramState_setUniformCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getVertexAttribsFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_applyAutoBinding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformVec2(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformVec3(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setVertexAttribCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_apply(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getNodeBinding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_applyGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setNodeBinding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformInt(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setParameterAutoBinding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformVec2v(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getUniformCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_applyAttributes(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformFloatv(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_applyUniforms(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformFloat(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformMat4(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_setUniformVec3v(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getVertexAttribCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getOrCreateWithGLProgramName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getOrCreateWithGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramState_getOrCreateWithShaders(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_SpriteFrame_class;
extern JS::PersistentRootedObject *jsb_cocos2d_SpriteFrame_prototype;

bool js_cocos2dx_SpriteFrame_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_SpriteFrame_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_SpriteFrame(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_SpriteFrame_setAnchorPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setOffsetInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getOriginalSizeInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setOriginalSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setRectInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_initWithTextureFilename(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_initWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getOriginalSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getRectInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_isRotated(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setRotated(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_setOriginalSizeInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getAnchorPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_hasAnchorPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_getOffsetInPixels(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_createWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrame_SpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ActionInterval_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ActionInterval_prototype;

bool js_cocos2dx_ActionInterval_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ActionInterval_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ActionInterval(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ActionInterval_getAmplitudeRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionInterval_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionInterval_setAmplitudeRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionInterval_getElapsed(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Sequence_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Sequence_prototype;

bool js_cocos2dx_Sequence_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Sequence_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Sequence(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Sequence_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sequence_initWithTwoActions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sequence_Sequence(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Repeat_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Repeat_prototype;

bool js_cocos2dx_Repeat_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Repeat_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Repeat(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Repeat_setInnerAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Repeat_initWithAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Repeat_getInnerAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Repeat_Repeat(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_RepeatForever_class;
extern JS::PersistentRootedObject *jsb_cocos2d_RepeatForever_prototype;

bool js_cocos2dx_RepeatForever_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_RepeatForever_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_RepeatForever(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_RepeatForever_setInnerAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RepeatForever_initWithAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RepeatForever_getInnerAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RepeatForever_RepeatForever(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Spawn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Spawn_prototype;

bool js_cocos2dx_Spawn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Spawn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Spawn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Spawn_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Spawn_initWithTwoActions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Spawn_Spawn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_RotateTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_RotateTo_prototype;

bool js_cocos2dx_RotateTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_RotateTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_RotateTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_RotateTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RotateTo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RotateTo_RotateTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_RotateBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_RotateBy_prototype;

bool js_cocos2dx_RotateBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_RotateBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_RotateBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_RotateBy_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RotateBy_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RotateBy_RotateBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MoveBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MoveBy_prototype;

bool js_cocos2dx_MoveBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MoveBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MoveBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MoveBy_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MoveBy_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MoveBy_MoveBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MoveTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MoveTo_prototype;

bool js_cocos2dx_MoveTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MoveTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MoveTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MoveTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MoveTo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MoveTo_MoveTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_SkewTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_SkewTo_prototype;

bool js_cocos2dx_SkewTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_SkewTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_SkewTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_SkewTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SkewTo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SkewTo_SkewTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_SkewBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_SkewBy_prototype;

bool js_cocos2dx_SkewBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_SkewBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_SkewBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_SkewBy_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SkewBy_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SkewBy_SkewBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_JumpBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_JumpBy_prototype;

bool js_cocos2dx_JumpBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_JumpBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_JumpBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_JumpBy_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_JumpBy_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_JumpBy_JumpBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_JumpTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_JumpTo_prototype;

bool js_cocos2dx_JumpTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_JumpTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_JumpTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_JumpTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_JumpTo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_JumpTo_JumpTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_BezierBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_BezierBy_prototype;

bool js_cocos2dx_BezierBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_BezierBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_BezierBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_BezierBy_BezierBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_BezierTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_BezierTo_prototype;

bool js_cocos2dx_BezierTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_BezierTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_BezierTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_BezierTo_BezierTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ScaleTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ScaleTo_prototype;

bool js_cocos2dx_ScaleTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ScaleTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ScaleTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ScaleTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ScaleTo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ScaleTo_ScaleTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ScaleBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ScaleBy_prototype;

bool js_cocos2dx_ScaleBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ScaleBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ScaleBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ScaleBy_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ScaleBy_ScaleBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Blink_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Blink_prototype;

bool js_cocos2dx_Blink_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Blink_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Blink(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Blink_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Blink_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Blink_Blink(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_FadeTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_FadeTo_prototype;

bool js_cocos2dx_FadeTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_FadeTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_FadeTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_FadeTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FadeTo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FadeTo_FadeTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_FadeIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_FadeIn_prototype;

bool js_cocos2dx_FadeIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_FadeIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_FadeIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_FadeIn_setReverseAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FadeIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FadeIn_FadeIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_FadeOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_FadeOut_prototype;

bool js_cocos2dx_FadeOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_FadeOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_FadeOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_FadeOut_setReverseAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FadeOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FadeOut_FadeOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TintTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TintTo_prototype;

bool js_cocos2dx_TintTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TintTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TintTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TintTo_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TintTo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TintTo_TintTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TintBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TintBy_prototype;

bool js_cocos2dx_TintBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TintBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TintBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TintBy_initWithDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TintBy_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TintBy_TintBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_DelayTime_class;
extern JS::PersistentRootedObject *jsb_cocos2d_DelayTime_prototype;

bool js_cocos2dx_DelayTime_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_DelayTime_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_DelayTime(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_DelayTime_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DelayTime_DelayTime(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ReverseTime_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ReverseTime_prototype;

bool js_cocos2dx_ReverseTime_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ReverseTime_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ReverseTime(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ReverseTime_initWithAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ReverseTime_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ReverseTime_ReverseTime(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TargetedAction_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TargetedAction_prototype;

bool js_cocos2dx_TargetedAction_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TargetedAction_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TargetedAction(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TargetedAction_getForcedTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TargetedAction_initWithTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TargetedAction_setForcedTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TargetedAction_TargetedAction(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_CardinalSplineTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_CardinalSplineTo_prototype;

bool js_cocos2dx_CardinalSplineTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_CardinalSplineTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_CardinalSplineTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_CardinalSplineTo_getPoints(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_CardinalSplineTo_updatePosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_CardinalSplineTo_CardinalSplineTo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_CardinalSplineBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_CardinalSplineBy_prototype;

bool js_cocos2dx_CardinalSplineBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_CardinalSplineBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_CardinalSplineBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_CardinalSplineBy_CardinalSplineBy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_CatmullRomTo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_CatmullRomTo_prototype;

bool js_cocos2dx_CatmullRomTo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_CatmullRomTo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_CatmullRomTo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);

extern JSClass  *jsb_cocos2d_CatmullRomBy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_CatmullRomBy_prototype;

bool js_cocos2dx_CatmullRomBy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_CatmullRomBy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_CatmullRomBy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);

extern JSClass  *jsb_cocos2d_ActionEase_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ActionEase_prototype;

bool js_cocos2dx_ActionEase_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ActionEase_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ActionEase(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ActionEase_initWithAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionEase_getInnerAction(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseRateAction_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseRateAction_prototype;

bool js_cocos2dx_EaseRateAction_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseRateAction_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseRateAction(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseRateAction_setRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseRateAction_initWithAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseRateAction_getRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseRateAction_create(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseIn_prototype;

bool js_cocos2dx_EaseIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseIn_EaseIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseOut_prototype;

bool js_cocos2dx_EaseOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseOut_EaseOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseInOut_prototype;

bool js_cocos2dx_EaseInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseInOut_EaseInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseExponentialIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseExponentialIn_prototype;

bool js_cocos2dx_EaseExponentialIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseExponentialIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseExponentialIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseExponentialIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseExponentialIn_EaseExponentialIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseExponentialOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseExponentialOut_prototype;

bool js_cocos2dx_EaseExponentialOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseExponentialOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseExponentialOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseExponentialOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseExponentialOut_EaseExponentialOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseExponentialInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseExponentialInOut_prototype;

bool js_cocos2dx_EaseExponentialInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseExponentialInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseExponentialInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseExponentialInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseExponentialInOut_EaseExponentialInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseSineIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseSineIn_prototype;

bool js_cocos2dx_EaseSineIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseSineIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseSineIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseSineIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseSineIn_EaseSineIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseSineOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseSineOut_prototype;

bool js_cocos2dx_EaseSineOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseSineOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseSineOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseSineOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseSineOut_EaseSineOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseSineInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseSineInOut_prototype;

bool js_cocos2dx_EaseSineInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseSineInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseSineInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseSineInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseSineInOut_EaseSineInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseElastic_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseElastic_prototype;

bool js_cocos2dx_EaseElastic_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseElastic_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseElastic(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseElastic_setPeriod(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseElastic_initWithAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseElastic_getPeriod(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseElasticIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseElasticIn_prototype;

bool js_cocos2dx_EaseElasticIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseElasticIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseElasticIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseElasticIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseElasticIn_EaseElasticIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseElasticOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseElasticOut_prototype;

bool js_cocos2dx_EaseElasticOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseElasticOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseElasticOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseElasticOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseElasticOut_EaseElasticOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseElasticInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseElasticInOut_prototype;

bool js_cocos2dx_EaseElasticInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseElasticInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseElasticInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseElasticInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseElasticInOut_EaseElasticInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseBounce_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBounce_prototype;

bool js_cocos2dx_EaseBounce_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBounce_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBounce(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);

extern JSClass  *jsb_cocos2d_EaseBounceIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBounceIn_prototype;

bool js_cocos2dx_EaseBounceIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBounceIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBounceIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseBounceIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBounceIn_EaseBounceIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseBounceOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBounceOut_prototype;

bool js_cocos2dx_EaseBounceOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBounceOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBounceOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseBounceOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBounceOut_EaseBounceOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseBounceInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBounceInOut_prototype;

bool js_cocos2dx_EaseBounceInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBounceInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBounceInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseBounceInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBounceInOut_EaseBounceInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseBackIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBackIn_prototype;

bool js_cocos2dx_EaseBackIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBackIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBackIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseBackIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBackIn_EaseBackIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseBackOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBackOut_prototype;

bool js_cocos2dx_EaseBackOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBackOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBackOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseBackOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBackOut_EaseBackOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseBackInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBackInOut_prototype;

bool js_cocos2dx_EaseBackInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBackInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBackInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseBackInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBackInOut_EaseBackInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseBezierAction_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseBezierAction_prototype;

bool js_cocos2dx_EaseBezierAction_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseBezierAction_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseBezierAction(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseBezierAction_setBezierParamer(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBezierAction_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseBezierAction_EaseBezierAction(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuadraticActionIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuadraticActionIn_prototype;

bool js_cocos2dx_EaseQuadraticActionIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuadraticActionIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuadraticActionIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuadraticActionIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuadraticActionIn_EaseQuadraticActionIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuadraticActionOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuadraticActionOut_prototype;

bool js_cocos2dx_EaseQuadraticActionOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuadraticActionOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuadraticActionOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuadraticActionOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuadraticActionOut_EaseQuadraticActionOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuadraticActionInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuadraticActionInOut_prototype;

bool js_cocos2dx_EaseQuadraticActionInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuadraticActionInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuadraticActionInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuadraticActionInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuadraticActionInOut_EaseQuadraticActionInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuarticActionIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuarticActionIn_prototype;

bool js_cocos2dx_EaseQuarticActionIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuarticActionIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuarticActionIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuarticActionIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuarticActionIn_EaseQuarticActionIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuarticActionOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuarticActionOut_prototype;

bool js_cocos2dx_EaseQuarticActionOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuarticActionOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuarticActionOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuarticActionOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuarticActionOut_EaseQuarticActionOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuarticActionInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuarticActionInOut_prototype;

bool js_cocos2dx_EaseQuarticActionInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuarticActionInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuarticActionInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuarticActionInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuarticActionInOut_EaseQuarticActionInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuinticActionIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuinticActionIn_prototype;

bool js_cocos2dx_EaseQuinticActionIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuinticActionIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuinticActionIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuinticActionIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuinticActionIn_EaseQuinticActionIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuinticActionOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuinticActionOut_prototype;

bool js_cocos2dx_EaseQuinticActionOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuinticActionOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuinticActionOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuinticActionOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuinticActionOut_EaseQuinticActionOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseQuinticActionInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseQuinticActionInOut_prototype;

bool js_cocos2dx_EaseQuinticActionInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseQuinticActionInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseQuinticActionInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseQuinticActionInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseQuinticActionInOut_EaseQuinticActionInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseCircleActionIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseCircleActionIn_prototype;

bool js_cocos2dx_EaseCircleActionIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseCircleActionIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseCircleActionIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseCircleActionIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseCircleActionIn_EaseCircleActionIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseCircleActionOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseCircleActionOut_prototype;

bool js_cocos2dx_EaseCircleActionOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseCircleActionOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseCircleActionOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseCircleActionOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseCircleActionOut_EaseCircleActionOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseCircleActionInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseCircleActionInOut_prototype;

bool js_cocos2dx_EaseCircleActionInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseCircleActionInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseCircleActionInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseCircleActionInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseCircleActionInOut_EaseCircleActionInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseCubicActionIn_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseCubicActionIn_prototype;

bool js_cocos2dx_EaseCubicActionIn_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseCubicActionIn_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseCubicActionIn(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseCubicActionIn_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseCubicActionIn_EaseCubicActionIn(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseCubicActionOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseCubicActionOut_prototype;

bool js_cocos2dx_EaseCubicActionOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseCubicActionOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseCubicActionOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseCubicActionOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseCubicActionOut_EaseCubicActionOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_EaseCubicActionInOut_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EaseCubicActionInOut_prototype;

bool js_cocos2dx_EaseCubicActionInOut_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_EaseCubicActionInOut_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_EaseCubicActionInOut(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_EaseCubicActionInOut_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_EaseCubicActionInOut_EaseCubicActionInOut(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ActionInstant_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ActionInstant_prototype;

bool js_cocos2dx_ActionInstant_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ActionInstant_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ActionInstant(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);

extern JSClass  *jsb_cocos2d_Show_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Show_prototype;

bool js_cocos2dx_Show_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Show_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Show(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Show_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Show_Show(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Hide_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Hide_prototype;

bool js_cocos2dx_Hide_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Hide_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Hide(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Hide_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Hide_Hide(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ToggleVisibility_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ToggleVisibility_prototype;

bool js_cocos2dx_ToggleVisibility_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ToggleVisibility_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ToggleVisibility(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ToggleVisibility_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ToggleVisibility_ToggleVisibility(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_RemoveSelf_class;
extern JS::PersistentRootedObject *jsb_cocos2d_RemoveSelf_prototype;

bool js_cocos2dx_RemoveSelf_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_RemoveSelf_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_RemoveSelf(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_RemoveSelf_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RemoveSelf_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RemoveSelf_RemoveSelf(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_FlipX_class;
extern JS::PersistentRootedObject *jsb_cocos2d_FlipX_prototype;

bool js_cocos2dx_FlipX_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_FlipX_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_FlipX(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_FlipX_initWithFlipX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FlipX_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FlipX_FlipX(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_FlipY_class;
extern JS::PersistentRootedObject *jsb_cocos2d_FlipY_prototype;

bool js_cocos2dx_FlipY_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_FlipY_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_FlipY(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_FlipY_initWithFlipY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FlipY_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_FlipY_FlipY(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Place_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Place_prototype;

bool js_cocos2dx_Place_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Place_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Place(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Place_initWithPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Place_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Place_Place(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_CallFunc_class;
extern JS::PersistentRootedObject *jsb_cocos2d_CallFunc_prototype;

bool js_cocos2dx_CallFunc_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_CallFunc_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_CallFunc(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_CallFunc_execute(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_CallFunc_CallFunc(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_CallFuncN_class;
extern JS::PersistentRootedObject *jsb_cocos2d_CallFuncN_prototype;

bool js_cocos2dx_CallFuncN_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_CallFuncN_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_CallFuncN(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_CallFuncN_CallFuncN(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ActionManager_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ActionManager_prototype;

bool js_cocos2dx_ActionManager_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ActionManager_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ActionManager(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ActionManager_getActionByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_removeActionByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_removeActionsByFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_removeAllActions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_addAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_resumeTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_update(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_pauseTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_getNumberOfRunningActionsInTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_removeAllActionsFromTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_resumeTargets(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_removeAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_removeAllActionsByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_pauseAllRunningActions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ActionManager_ActionManager(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_AtlasNode_class;
extern JS::PersistentRootedObject *jsb_cocos2d_AtlasNode_prototype;

bool js_cocos2dx_AtlasNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_AtlasNode_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_AtlasNode(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_AtlasNode_updateAtlasValues(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_initWithTileFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_setTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_getTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_getQuadsToDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_initWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_setQuadsToDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_AtlasNode_AtlasNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ClippingNode_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ClippingNode_prototype;

bool js_cocos2dx_ClippingNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ClippingNode_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ClippingNode(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ClippingNode_hasContent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_setInverted(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_setStencil(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_getAlphaThreshold(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_getStencil(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_setAlphaThreshold(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_isInverted(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ClippingNode_ClippingNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_DrawNode_class;
extern JS::PersistentRootedObject *jsb_cocos2d_DrawNode_prototype;

bool js_cocos2dx_DrawNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_DrawNode_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_DrawNode(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_DrawNode_drawLine(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawPoints(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawSolidCircle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_setLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_onDrawGLPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawPolygon(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawDot(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawCatmullRom(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawSegment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_onDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawCircle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawQuadBezier(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_onDrawGLLine(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawSolidPoly(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawTriangle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_clear(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawCardinalSpline(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawSolidRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_getLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_drawCubicBezier(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_DrawNode_DrawNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Label_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Label_prototype;

bool js_cocos2dx_Label_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Label_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Label(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Label_isClipMarginEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableShadow(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setDimensions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_disableEffect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getTextColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableWrap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getAdditionalKerning(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getBMFontSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getMaxLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getHorizontalAlignment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getShadowOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getLineSpacing(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setClipMarginEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setSystemFontName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_isWrapEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getOutlineSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setBMFontFilePath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_initWithTTF(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setLineHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setSystemFontSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setOverflow(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableStrikethrough(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_updateContent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getStringLength(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setLineBreakWithoutSpace(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getStringNumLines(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableOutline(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getShadowBlurRadius(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getEffectColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_removeAllChildrenWithCleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setCharMap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getFontDefinition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getDimensions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setMaxLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getSystemFontName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setVerticalAlignment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setLineSpacing(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getLineHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getShadowColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableItalics(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setTextColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getLetter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_isShadowEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableGlow(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getOverflow(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getVerticalAlignment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setAdditionalKerning(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getSystemFontSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getTextAlignment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getBMFontFilePath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setHorizontalAlignment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableBold(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_enableUnderline(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_getLabelEffectType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setFontDefinition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setAlignment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_requestSystemFontRefresh(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_setBMFontSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_createWithBMFont(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_createWithCharMap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_createWithSystemFont(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Label_Label(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_LabelTTF_class;
extern JS::PersistentRootedObject *jsb_cocos2d_LabelTTF_prototype;

bool js_cocos2dx_LabelTTF_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_LabelTTF_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_LabelTTF(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_LabelTTF_getRenderLabel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LabelTTF_LabelTTF(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Layer_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Layer_prototype;

bool js_cocos2dx_Layer_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Layer_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Layer(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Layer_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Layer_Layer(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_LayerColor_class;
extern JS::PersistentRootedObject *jsb_cocos2d_LayerColor_prototype;

bool js_cocos2dx_LayerColor_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_LayerColor_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_LayerColor(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_LayerColor_changeWidthAndHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerColor_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerColor_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerColor_changeWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerColor_initWithColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerColor_changeHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerColor_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerColor_LayerColor(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_LayerGradient_class;
extern JS::PersistentRootedObject *jsb_cocos2d_LayerGradient_prototype;

bool js_cocos2dx_LayerGradient_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_LayerGradient_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_LayerGradient(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_LayerGradient_getStartColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_isCompressedInterpolation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_getStartOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_setVector(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_setStartOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_setCompressedInterpolation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_setEndOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_getVector(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_setEndColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_initWithColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_getEndColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_getEndOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_setStartColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerGradient_LayerGradient(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_LayerMultiplex_class;
extern JS::PersistentRootedObject *jsb_cocos2d_LayerMultiplex_prototype;

bool js_cocos2dx_LayerMultiplex_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_LayerMultiplex_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_LayerMultiplex(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_LayerMultiplex_initWithArray(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerMultiplex_switchToAndReleaseMe(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerMultiplex_addLayer(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerMultiplex_switchTo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_LayerMultiplex_LayerMultiplex(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MenuItem_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MenuItem_prototype;

bool js_cocos2dx_MenuItem_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MenuItem_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MenuItem(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MenuItem_setEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_activate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_initWithCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_isEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_selected(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_isSelected(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_setCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_unselected(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_rect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItem_MenuItem(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MenuItemLabel_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MenuItemLabel_prototype;

bool js_cocos2dx_MenuItemLabel_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MenuItemLabel_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MenuItemLabel(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MenuItemLabel_setLabel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemLabel_getString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemLabel_getDisabledColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemLabel_setString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemLabel_initWithLabel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemLabel_setDisabledColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemLabel_getLabel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemLabel_MenuItemLabel(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MenuItemAtlasFont_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MenuItemAtlasFont_prototype;

bool js_cocos2dx_MenuItemAtlasFont_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MenuItemAtlasFont_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MenuItemAtlasFont(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MenuItemAtlasFont_initWithString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemAtlasFont_MenuItemAtlasFont(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MenuItemFont_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MenuItemFont_prototype;

bool js_cocos2dx_MenuItemFont_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MenuItemFont_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MenuItemFont(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MenuItemFont_setFontNameObj(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_getFontSizeObj(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_setFontSizeObj(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_initWithString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_getFontNameObj(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_setFontName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_getFontSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_getFontName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_setFontSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemFont_MenuItemFont(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MenuItemSprite_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MenuItemSprite_prototype;

bool js_cocos2dx_MenuItemSprite_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MenuItemSprite_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MenuItemSprite(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MenuItemSprite_setEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_selected(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_setNormalImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_setDisabledImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_initWithNormalSprite(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_setSelectedImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_getDisabledImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_getSelectedImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_getNormalImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_unselected(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemSprite_MenuItemSprite(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MenuItemImage_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MenuItemImage_prototype;

bool js_cocos2dx_MenuItemImage_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MenuItemImage_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MenuItemImage(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MenuItemImage_setDisabledSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemImage_setSelectedSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemImage_setNormalSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemImage_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemImage_initWithNormalImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemImage_MenuItemImage(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MenuItemToggle_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MenuItemToggle_prototype;

bool js_cocos2dx_MenuItemToggle_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MenuItemToggle_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MenuItemToggle(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MenuItemToggle_setSubItems(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemToggle_initWithItem(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemToggle_getSelectedIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemToggle_addSubItem(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemToggle_getSelectedItem(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemToggle_setSelectedIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MenuItemToggle_MenuItemToggle(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Menu_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Menu_prototype;

bool js_cocos2dx_Menu_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Menu_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Menu(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Menu_initWithArray(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Menu_setEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Menu_alignItemsVertically(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Menu_isEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Menu_alignItemsHorizontallyWithPadding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Menu_alignItemsVerticallyWithPadding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Menu_alignItemsHorizontally(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Menu_Menu(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_MotionStreak_class;
extern JS::PersistentRootedObject *jsb_cocos2d_MotionStreak_prototype;

bool js_cocos2dx_MotionStreak_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_MotionStreak_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_MotionStreak(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_MotionStreak_reset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_setMinSeg(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_tintWithColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_getMinSeg(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_setFadeTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_setStartingPositionInitialized(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_getFadeTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_isStartingPositionInitialized(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_isFastMode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_getStroke(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_initWithFade(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_setFastMode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_setStroke(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_MotionStreak_MotionStreak(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleBatchNode_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleBatchNode_prototype;

bool js_cocos2dx_ParticleBatchNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleBatchNode_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleBatchNode(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleBatchNode_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_initWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_disableParticle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_setTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_initWithFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_removeAllChildrenWithCleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_getTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_insertChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_removeChildAtIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_createWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleBatchNode_ParticleBatchNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleData_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleData_prototype;

bool js_cocos2dx_ParticleData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleData_release(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleData_getMaxCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleData_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleData_copyParticle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleData_ParticleData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleSystem_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleSystem_prototype;

bool js_cocos2dx_ParticleSystem_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleSystem_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleSystem(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleSystem_getStartSizeVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_isFull(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getBatchNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getStartColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getPositionType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setPosVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndSpin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setRotatePerSecondVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getStartSpinVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getRadialAccelVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndSizeVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setTangentialAccel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getRadialAccel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartRadius(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setRotatePerSecond(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getGravity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_resumeEmissions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getTangentialAccel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndRadius(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_pauseEmissions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartSpin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_addParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getPosVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_updateWithNoTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_isBlendAdditive(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getSpeedVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setPositionType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_stopSystem(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getSourcePosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setLifeVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndColorVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getAtlasIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getStartSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartSpinVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_resetSystem(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setAtlasIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setTangentialAccelVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndRadiusVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndRadius(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_isActive(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setRadialAccelVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getStartSpin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getResourceFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getRotatePerSecond(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEmitterMode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getDuration(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setSourcePosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_stop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_updateParticleQuads(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndSpinVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setBlendAdditive(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setLife(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setAngleVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setRotationIsDir(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_start(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndSizeVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setBatchNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getTangentialAccelVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEmitterMode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndSpinVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_initWithFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getAngleVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getRotatePerSecondVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getLife(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_isPaused(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setSpeedVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setAutoRemoveOnFinish(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setGravity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_postStep(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEmissionRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndColorVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getRotationIsDir(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEmissionRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getLifeVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartSizeVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getStartRadius(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getParticleCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getStartRadiusVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartColorVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setEndSpin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setRadialAccel(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_initWithDictionary(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_isAutoRemoveOnFinish(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setStartRadiusVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getEndRadiusVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_getStartColorVar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystem_ParticleSystem(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleSystemQuad_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleSystemQuad_prototype;

bool js_cocos2dx_ParticleSystemQuad_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleSystemQuad_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleSystemQuad(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleSystemQuad_setDisplayFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystemQuad_setTextureWithRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystemQuad_listenRendererRecreated(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystemQuad_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystemQuad_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSystemQuad_ParticleSystemQuad(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleFire_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleFire_prototype;

bool js_cocos2dx_ParticleFire_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleFire_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleFire(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleFire_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFire_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFire_ParticleFire(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleFireworks_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleFireworks_prototype;

bool js_cocos2dx_ParticleFireworks_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleFireworks_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleFireworks(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleFireworks_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFireworks_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFireworks_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFireworks_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFireworks_ParticleFireworks(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleSun_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleSun_prototype;

bool js_cocos2dx_ParticleSun_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleSun_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleSun(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleSun_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSun_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSun_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSun_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSun_ParticleSun(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleGalaxy_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleGalaxy_prototype;

bool js_cocos2dx_ParticleGalaxy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleGalaxy_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleGalaxy(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleGalaxy_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleGalaxy_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleGalaxy_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleGalaxy_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleGalaxy_ParticleGalaxy(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleFlower_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleFlower_prototype;

bool js_cocos2dx_ParticleFlower_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleFlower_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleFlower(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleFlower_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFlower_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFlower_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFlower_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleFlower_ParticleFlower(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleMeteor_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleMeteor_prototype;

bool js_cocos2dx_ParticleMeteor_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleMeteor_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleMeteor(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleMeteor_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleMeteor_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleMeteor_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleMeteor_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleMeteor_ParticleMeteor(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleSpiral_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleSpiral_prototype;

bool js_cocos2dx_ParticleSpiral_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleSpiral_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleSpiral(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleSpiral_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSpiral_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSpiral_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSpiral_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSpiral_ParticleSpiral(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleExplosion_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleExplosion_prototype;

bool js_cocos2dx_ParticleExplosion_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleExplosion_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleExplosion(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleExplosion_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleExplosion_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleExplosion_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleExplosion_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleExplosion_ParticleExplosion(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleSmoke_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleSmoke_prototype;

bool js_cocos2dx_ParticleSmoke_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleSmoke_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleSmoke(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleSmoke_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSmoke_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSmoke_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSmoke_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSmoke_ParticleSmoke(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleSnow_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleSnow_prototype;

bool js_cocos2dx_ParticleSnow_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleSnow_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleSnow(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleSnow_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSnow_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSnow_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSnow_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleSnow_ParticleSnow(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParticleRain_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParticleRain_prototype;

bool js_cocos2dx_ParticleRain_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParticleRain_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParticleRain(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParticleRain_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleRain_initWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleRain_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleRain_createWithTotalParticles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParticleRain_ParticleRain(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ProtectedNode_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ProtectedNode_prototype;

bool js_cocos2dx_ProtectedNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ProtectedNode_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ProtectedNode(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ProtectedNode_addProtectedChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_disableCascadeColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_removeProtectedChildByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_reorderProtectedChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_removeAllProtectedChildrenWithCleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_disableCascadeOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_sortAllProtectedChildren(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_getProtectedChildByTag(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_removeProtectedChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_removeAllProtectedChildren(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ProtectedNode_ProtectedNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Sprite_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Sprite_prototype;

bool js_cocos2dx_Sprite_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Sprite_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Sprite(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Sprite_setSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setFlippedY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setFlippedX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setRotationSkewX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setRotationSkewY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getResourceType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_initWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getBatchNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getOffsetPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_removeAllChildrenWithCleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setTextureRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_initWithSpriteFrameName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_isFrameDisplayed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getAtlasIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setBatchNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setDisplayFrameWithAnimationName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getResourceName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_isDirty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setAtlasIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setDirty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_isTextureRectRotated(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getTextureRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_initWithFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_getTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_initWithSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_isFlippedX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_isFlippedY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_setVertexRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Sprite_Sprite(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_RenderTexture_class;
extern JS::PersistentRootedObject *jsb_cocos2d_RenderTexture_prototype;

bool js_cocos2dx_RenderTexture_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_RenderTexture_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_RenderTexture(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_RenderTexture_setVirtualViewport(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_clearStencil(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_getClearDepth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_getClearStencil(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_end(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_setClearStencil(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_setSprite(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_getSprite(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_isAutoDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_setKeepMatrix(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_setClearFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_begin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_setAutoDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_setClearColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_beginWithClear(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_clearDepth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_getClearColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_clear(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_getClearFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_newImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_setClearDepth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_initWithWidthAndHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderTexture_RenderTexture(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_GLProgram_class;
extern JS::PersistentRootedObject *jsb_cocos2d_GLProgram_prototype;

bool js_cocos2dx_GLProgram_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_GLProgram_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_GLProgram(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_GLProgram_getFragmentShaderLog(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_bindAttribLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_getUniformLocationForName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_use(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_getVertexShaderLog(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_getUniform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_initWithByteArrays(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith1f(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_initWithFilenames(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith3f(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformsForBuiltins(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith3i(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith4f(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_updateUniforms(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_getUniformLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_link(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_reset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_getAttribLocation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith2f(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith4i(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith1i(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_setUniformLocationWith2i(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_createWithByteArrays(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_createWithFilenames(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgram_GLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_GLProgramCache_class;
extern JS::PersistentRootedObject *jsb_cocos2d_GLProgramCache_prototype;

bool js_cocos2dx_GLProgramCache_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_GLProgramCache_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_GLProgramCache(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_GLProgramCache_loadDefaultGLPrograms(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramCache_reloadDefaultGLProgramsRelativeToLights(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramCache_addGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramCache_reloadDefaultGLPrograms(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramCache_getGLProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramCache_destroyInstance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramCache_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_GLProgramCache_GLProgramCache(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_RenderState_class;
extern JS::PersistentRootedObject *jsb_cocos2d_RenderState_prototype;

bool js_cocos2dx_RenderState_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_RenderState_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_RenderState(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_RenderState_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_getTopmost(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_bind(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_getName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_getStateBlock(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_setParent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_initialize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_RenderState_finalize(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Pass_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Pass_prototype;

bool js_cocos2dx_Pass_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Pass_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Pass(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Pass_unbind(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_bind(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_getGLProgramState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_getVertexAttributeBinding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_getHash(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_setVertexAttribBinding(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Pass_createWithGLProgramState(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Material_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Material_prototype;

bool js_cocos2dx_Material_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Material_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Material(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Material_clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_getTechniqueCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_setName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_getTechniqueByIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_getName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_getTechniques(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_setTechnique(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_getTechniqueByName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_addTechnique(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_getTechnique(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_createWithFilename(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_createWithGLStateProgram(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Material_createWithProperties(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TextureCache_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TextureCache_prototype;

bool js_cocos2dx_TextureCache_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TextureCache_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TextureCache(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TextureCache_reloadTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_unbindAllImageAsync(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_removeTextureForKey(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_removeAllTextures(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_addImageAsync(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_getAllTextures(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_getDescription(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_getCachedTextureInfo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_addImage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_unbindImageAsync(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_getTextureForKey(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_getTextureFilePath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_renameTextureWithKey(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_removeUnusedTextures(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_removeTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_waitForQuit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextureCache_TextureCache(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Device_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Device_prototype;

bool js_cocos2dx_Device_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Device_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Device(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Device_setAccelerometerEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Device_setAccelerometerInterval(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Device_setKeepScreenOn(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Device_vibrate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Device_getDPI(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_SAXParser_class;
extern JS::PersistentRootedObject *jsb_cocos2d_SAXParser_prototype;

bool js_cocos2dx_SAXParser_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_SAXParser_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_SAXParser(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_SAXParser_init(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_Application_class;
extern JS::PersistentRootedObject *jsb_cocos2d_Application_prototype;

bool js_cocos2dx_Application_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_Application_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_Application(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_Application_getTargetPlatform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Application_getCurrentLanguage(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Application_openURL(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Application_getVersion(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Application_destroyInstance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Application_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_SpriteBatchNode_class;
extern JS::PersistentRootedObject *jsb_cocos2d_SpriteBatchNode_prototype;

bool js_cocos2dx_SpriteBatchNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_SpriteBatchNode_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_SpriteBatchNode(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_SpriteBatchNode_appendChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_addSpriteWithoutQuad(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_reorderBatch(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_initWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_lowestAtlasIndexInChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_atlasIndexForChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_setTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_initWithFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_increaseAtlasCapacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_getTextureAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_insertQuadFromSprite(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_rebuildIndexInOrder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_highestAtlasIndexInChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_removeChildAtIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_removeSpriteFromAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_createWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteBatchNode_SpriteBatchNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_SpriteFrameCache_class;
extern JS::PersistentRootedObject *jsb_cocos2d_SpriteFrameCache_prototype;

bool js_cocos2dx_SpriteFrameCache_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_SpriteFrameCache_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_SpriteFrameCache(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_SpriteFrameCache_reloadTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_addSpriteFramesWithFileContent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_addSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_addSpriteFramesWithFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_getSpriteFrameByName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_removeSpriteFramesFromFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_removeSpriteFrames(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_removeUnusedSpriteFrames(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_removeSpriteFramesFromFileContent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_removeSpriteFrameByName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_isSpriteFramesWithFileLoaded(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_removeSpriteFramesFromTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_destroyInstance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_SpriteFrameCache_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TextFieldTTF_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TextFieldTTF_prototype;

bool js_cocos2dx_TextFieldTTF_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TextFieldTTF_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TextFieldTTF(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TextFieldTTF_getCharCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setCursorChar(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setSecureTextEntry(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setCursorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_getColorSpaceHolder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_initWithPlaceHolder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_appendString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_getPasswordTextStyle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setPasswordTextStyle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setColorSpaceHolder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_detachWithIME(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setPlaceHolder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setCursorFromPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_isSecureTextEntry(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_getPlaceHolder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_setCursorPosition(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_attachWithIME(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_textFieldWithPlaceHolder(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TextFieldTTF_TextFieldTTF(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_ParallaxNode_class;
extern JS::PersistentRootedObject *jsb_cocos2d_ParallaxNode_prototype;

bool js_cocos2dx_ParallaxNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_ParallaxNode_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_ParallaxNode(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_ParallaxNode_addChild(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParallaxNode_removeAllChildrenWithCleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParallaxNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_ParallaxNode_ParallaxNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXObject_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXObject_prototype;

bool js_cocos2dx_TMXObject_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXObject_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXObject(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXObject_getGid(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_setObjectName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getObjectSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getProperty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getObjectVisible(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getId(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getObjectRotation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_setProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getObjectName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_getNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObject_TMXObject(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXObjectImage_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXObjectImage_prototype;

bool js_cocos2dx_TMXObjectImage_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXObjectImage_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXObjectImage(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXObjectImage_TMXObjectImage(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXObjectShape_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXObjectShape_prototype;

bool js_cocos2dx_TMXObjectShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXObjectShape_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXObjectShape(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXObjectShape_TMXObjectShape(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXObjectGroup_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXObjectGroup_prototype;

bool js_cocos2dx_TMXObjectGroup_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXObjectGroup_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXObjectGroup(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXObjectGroup_setPositionOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_getProperty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_getPositionOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_getObject(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_getObjects(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_setGroupName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_getProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_getGroupName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_setProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroup_TMXObjectGroup(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXLayerInfo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXLayerInfo_prototype;

bool js_cocos2dx_TMXLayerInfo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXLayerInfo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXLayerInfo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXLayerInfo_setProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayerInfo_getProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayerInfo_TMXLayerInfo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXObjectGroupInfo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXObjectGroupInfo_prototype;

bool js_cocos2dx_TMXObjectGroupInfo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXObjectGroupInfo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXObjectGroupInfo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXObjectGroupInfo_setProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroupInfo_getProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXObjectGroupInfo_TMXObjectGroupInfo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXTilesetInfo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXTilesetInfo_prototype;

bool js_cocos2dx_TMXTilesetInfo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXTilesetInfo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXTilesetInfo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXTilesetInfo_getRectForGID(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTilesetInfo_TMXTilesetInfo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXMapInfo_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXMapInfo_prototype;

bool js_cocos2dx_TMXMapInfo_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXMapInfo_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXMapInfo(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXMapInfo_getAllChildren(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getHexSideLength(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setTileSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_initWithTMXFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getOrientation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setObjectGroups(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setLayers(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_parseXMLFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getParentElement(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setTMXFileName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_parseXMLString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getLayers(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getStaggerAxis(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setHexSideLength(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getTilesets(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getParentGID(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setParentElement(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_initWithXML(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setParentGID(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getLayerAttribs(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getTileSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setAllChildren(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getTileProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_isStoringCharacters(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getExternalTilesetFileName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getObjectGroups(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getTMXFileName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setStaggerIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setCurrentString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setOrientation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setTileProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setMapSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getCurrentString(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setStoringCharacters(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setStaggerAxis(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getMapSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setTilesets(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_getStaggerIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_setLayerAttribs(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_createWithXML(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXMapInfo_TMXMapInfo(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXLayer_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXLayer_prototype;

bool js_cocos2dx_TMXLayer_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXLayer_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXLayer(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXLayer_getTileGIDAt(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getPositionAt(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setLayerOrientation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setTileOpacity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_releaseMap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getLayerSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setMapTileSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getLayerOrientation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setLayerName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_removeTileAt(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_initWithTilesetInfo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setupTiles(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setTileGID(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getMapTileSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getProperty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setLayerSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getLayerName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_setTileSet(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getTileSet(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_getTileAt(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXLayer_TMXLayer(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TMXTiledMap_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TMXTiledMap_prototype;

bool js_cocos2dx_TMXTiledMap_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TMXTiledMap_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TMXTiledMap(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TMXTiledMap_getProperty(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getLayerNum(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_setMapSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getObjectGroup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getObjectGroups(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getResourceFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_initWithTMXFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getTileSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getMapSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_initWithXML(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getPropertiesForGID(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_setTileSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_setProperties(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getLayer(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_getMapOrientation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_setMapOrientation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_createWithXML(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TMXTiledMap_TMXTiledMap(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_TileMapAtlas_class;
extern JS::PersistentRootedObject *jsb_cocos2d_TileMapAtlas_prototype;

bool js_cocos2dx_TileMapAtlas_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_TileMapAtlas_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_TileMapAtlas(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_TileMapAtlas_initWithTileFile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TileMapAtlas_releaseMap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TileMapAtlas_getTileAt(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TileMapAtlas_setTile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TileMapAtlas_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_TileMapAtlas_TileMapAtlas(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_cocos2d_BaseJSAction_class;
extern JS::PersistentRootedObject *jsb_cocos2d_BaseJSAction_prototype;

bool js_cocos2dx_BaseJSAction_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_BaseJSAction_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_BaseJSAction(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_BaseJSAction_BaseJSAction(JSContext *cx, uint32_t argc, JS::Value *vp);

#endif // __cocos2dx_h__
