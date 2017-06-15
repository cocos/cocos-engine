//
// Created by James Chen on 4/28/17.
//

#ifndef COCOS2D_JS_BINDINGS_JSB_GLOBAL_H
#define COCOS2D_JS_BINDINGS_JSB_GLOBAL_H

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __ccObj;
extern se::Object* __jsbObj;

bool jsb_register_global_variables();


#endif //COCOS2D_JS_BINDINGS_JSB_GLOBAL_H
