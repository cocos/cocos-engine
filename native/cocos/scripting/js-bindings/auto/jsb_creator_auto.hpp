#include "base/ccConfig.h"
#ifndef __creator_h__
#define __creator_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_creator_Scale9SpriteV2_class;
extern JS::PersistentRootedObject *jsb_creator_Scale9SpriteV2_prototype;

bool js_creator_Scale9SpriteV2_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_Scale9SpriteV2_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_Scale9SpriteV2(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_Scale9SpriteV2_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getFillType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setInsetBottom(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setFillRange(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getFillStart(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getFillRange(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setInsetTop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setRenderingType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setDistortionOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setFillCenter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_initWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getInsetLeft(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getInsetBottom(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setDistortionTiling(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getRenderingType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setFillStart(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getInsetRight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getFillCenter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_getInsetTop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setInsetLeft(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_initWithSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setFillType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_setInsetRight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_enableTrimmedContentSize(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_Scale9SpriteV2_Scale9SpriteV2(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_GraphicsNode_class;
extern JS::PersistentRootedObject *jsb_creator_GraphicsNode_prototype;

bool js_creator_GraphicsNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_GraphicsNode_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_GraphicsNode(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_GraphicsNode_quadraticCurveTo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_moveTo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_lineTo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_stroke(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_arc(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_setLineJoin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_close(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_ellipse(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_setLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_fill(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_getStrokeColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_setLineCap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_circle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_roundRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_draw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_bezierCurveTo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_arcTo(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_fillRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_onDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_setFillColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_getFillColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_beginPath(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_setDeviceRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_rect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_getMiterLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_getLineJoin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_getLineCap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_setMiterLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_clear(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_getDeviceRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_getLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_setStrokeColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_create(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_GraphicsNode_GraphicsNode(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_PhysicsDebugDraw_class;
extern JS::PersistentRootedObject *jsb_creator_PhysicsDebugDraw_prototype;

bool js_creator_PhysicsDebugDraw_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_PhysicsDebugDraw_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_PhysicsDebugDraw(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_PhysicsDebugDraw_getDrawer(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsDebugDraw_ClearDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsDebugDraw_AddDrawerToNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsDebugDraw_PhysicsDebugDraw(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_PhysicsWorldManifoldWrapper_class;
extern JS::PersistentRootedObject *jsb_creator_PhysicsWorldManifoldWrapper_prototype;

bool js_creator_PhysicsWorldManifoldWrapper_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_PhysicsWorldManifoldWrapper_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_PhysicsWorldManifoldWrapper(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_PhysicsWorldManifoldWrapper_getSeparation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsWorldManifoldWrapper_getX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsWorldManifoldWrapper_getY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsWorldManifoldWrapper_getCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsWorldManifoldWrapper_getNormalY(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsWorldManifoldWrapper_getNormalX(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsWorldManifoldWrapper_PhysicsWorldManifoldWrapper(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_PhysicsUtils_class;
extern JS::PersistentRootedObject *jsb_creator_PhysicsUtils_prototype;

bool js_creator_PhysicsUtils_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_PhysicsUtils_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_PhysicsUtils(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_PhysicsUtils_addB2Body(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsUtils_syncNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsUtils_removeB2Body(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsUtils_getContactManifoldWrapper(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsUtils_getContactWorldManifoldWrapper(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsUtils_PhysicsUtils(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_PhysicsContactImpulse_class;
extern JS::PersistentRootedObject *jsb_creator_PhysicsContactImpulse_prototype;

bool js_creator_PhysicsContactImpulse_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_PhysicsContactImpulse_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_PhysicsContactImpulse(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_PhysicsContactImpulse_getCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsContactImpulse_getNormalImpulse(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsContactImpulse_getTangentImpulse(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsContactImpulse_PhysicsContactImpulse(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_PhysicsContactListener_class;
extern JS::PersistentRootedObject *jsb_creator_PhysicsContactListener_prototype;

bool js_creator_PhysicsContactListener_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_PhysicsContactListener_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_PhysicsContactListener(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_PhysicsContactListener_unregisterContactFixture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsContactListener_registerContactFixture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsContactListener_PhysicsContactListener(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_PhysicsAABBQueryCallback_class;
extern JS::PersistentRootedObject *jsb_creator_PhysicsAABBQueryCallback_prototype;

bool js_creator_PhysicsAABBQueryCallback_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_PhysicsAABBQueryCallback_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_PhysicsAABBQueryCallback(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_PhysicsAABBQueryCallback_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsAABBQueryCallback_getFixture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsAABBQueryCallback_PhysicsAABBQueryCallback(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_PhysicsRayCastCallback_class;
extern JS::PersistentRootedObject *jsb_creator_PhysicsRayCastCallback_prototype;

bool js_creator_PhysicsRayCastCallback_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_PhysicsRayCastCallback_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_PhysicsRayCastCallback(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_PhysicsRayCastCallback_getType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsRayCastCallback_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsRayCastCallback_getFractions(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_PhysicsRayCastCallback_PhysicsRayCastCallback(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_creator_CameraNode_class;
extern JS::PersistentRootedObject *jsb_creator_CameraNode_prototype;

bool js_creator_CameraNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_creator_CameraNode_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_CameraNode(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_CameraNode_removeTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_CameraNode_setTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_CameraNode_getVisibleRect(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_CameraNode_containsNode(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_CameraNode_addTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_CameraNode_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_creator_CameraNode_CameraNode(JSContext *cx, uint32_t argc, JS::Value *vp);

#endif // __creator_h__
