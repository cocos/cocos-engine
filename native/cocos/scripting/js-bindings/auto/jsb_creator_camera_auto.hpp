#pragma once
#include "base/ccConfig.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_creator_CameraNode_proto;
extern se::Class* __jsb_creator_CameraNode_class;

bool js_register_creator_CameraNode(se::Object* obj);
bool register_all_creator_camera(se::Object* obj);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_removeTarget);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_setTransform);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_getVisibleRect);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_setEnable);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_containsNode);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_addTarget);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_getInstance);
SE_DECLARE_FUNC(js_creator_camera_CameraNode_CameraNode);

