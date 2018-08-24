#pragma once
#include "base/ccConfig.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_SAXParser_proto;
extern se::Class* __jsb_cocos2d_SAXParser_class;

bool js_register_cocos2d_SAXParser(se::Object* obj);
bool register_all_cocos2dx(se::Object* obj);
SE_DECLARE_FUNC(js_cocos2dx_SAXParser_init);

extern se::Object* __jsb_cocos2d_CanvasGradient_proto;
extern se::Class* __jsb_cocos2d_CanvasGradient_class;

bool js_register_cocos2d_CanvasGradient(se::Object* obj);
bool register_all_cocos2dx(se::Object* obj);
SE_DECLARE_FUNC(js_cocos2dx_CanvasGradient_addColorStop);
SE_DECLARE_FUNC(js_cocos2dx_CanvasGradient_CanvasGradient);

