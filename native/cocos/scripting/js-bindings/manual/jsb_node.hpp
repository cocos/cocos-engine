//
//  jsb_node.hpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 4/26/17.
//
//

#ifndef jsb_node_hpp
#define jsb_node_hpp

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_Node_proto;
extern se::Class* __jsb_Node_class;

bool jsb_register_Node_manual();

#endif /* jsb_node_hpp */
