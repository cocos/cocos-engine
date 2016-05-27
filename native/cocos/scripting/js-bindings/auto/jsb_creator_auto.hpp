#include "base/ccConfig.h"
#ifndef __creator_h__
#define __creator_h__

#include "spidermonkey/jsapi.h"
#include "spidermonkey/jsfriendapi.h"

extern JSClass  *jsb_creator_Scale9SpriteV2_class;
extern JSObject *jsb_creator_Scale9SpriteV2_prototype;

bool js_creator_Scale9SpriteV2_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_creator_Scale9SpriteV2_finalize(JSContext *cx, JSObject *obj);
void js_register_creator_Scale9SpriteV2(JSContext *cx, JS::HandleObject global);
void register_all_creator(JSContext* cx, JS::HandleObject obj);
bool js_creator_Scale9SpriteV2_setTexture(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getFillType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getState(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setState(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setInsetBottom(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setFillRange(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getFillStart(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getFillRange(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setInsetTop(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setRenderingType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setDistortionOffset(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setFillCenter(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setSpriteFrame(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getBlendFunc(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_initWithTexture(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getInsetLeft(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getInsetBottom(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setDistortionTiling(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getRenderingType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setFillStart(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getInsetRight(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setBlendFunc(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getFillCenter(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_getInsetTop(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setInsetLeft(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_initWithSpriteFrame(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setFillType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_setInsetRight(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_enableTrimmedContentSize(JSContext *cx, uint32_t argc, jsval *vp);
bool js_creator_Scale9SpriteV2_Scale9SpriteV2(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __creator_h__
