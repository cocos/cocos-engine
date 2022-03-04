// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/platform/FileUtils.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/platform/interfaces/modules/canvas/CanvasRenderingContext2D.h"
#include "cocos/platform/interfaces/modules/Device.h"
#include "cocos/platform/SAXParser.h"
#include "cocos/math/Vec2.h"
#include "cocos/math/Vec3.h"
#include "cocos/math/Quaternion.h"
#include "cocos/math/Color.h"
#include "cocos/core/data/Object.h"

bool register_all_engine(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::FileUtils);
JSB_REGISTER_OBJECT_TYPE(cc::OSInterface);
JSB_REGISTER_OBJECT_TYPE(cc::Vec2);
JSB_REGISTER_OBJECT_TYPE(cc::ICanvasGradient);
JSB_REGISTER_OBJECT_TYPE(cc::ICanvasRenderingContext2D);
JSB_REGISTER_OBJECT_TYPE(cc::CanvasGradient);
JSB_REGISTER_OBJECT_TYPE(cc::CanvasRenderingContext2D);
JSB_REGISTER_OBJECT_TYPE(cc::Device);
JSB_REGISTER_OBJECT_TYPE(cc::SAXParser);
JSB_REGISTER_OBJECT_TYPE(cc::Color);
JSB_REGISTER_OBJECT_TYPE(cc::CCObject);


extern se::Object *__jsb_cc_FileUtils_proto; // NOLINT
extern se::Class * __jsb_cc_FileUtils_class; // NOLINT

bool js_register_cc_FileUtils(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_FileUtils_addSearchPath);
SE_DECLARE_FUNC(js_engine_FileUtils_createDirectory);
SE_DECLARE_FUNC(js_engine_FileUtils_fullPathForFilename);
SE_DECLARE_FUNC(js_engine_FileUtils_fullPathFromRelativeFile);
SE_DECLARE_FUNC(js_engine_FileUtils_getDataFromFile);
SE_DECLARE_FUNC(js_engine_FileUtils_getDefaultResourceRootPath);
SE_DECLARE_FUNC(js_engine_FileUtils_getFileExtension);
SE_DECLARE_FUNC(js_engine_FileUtils_getFileSize);
SE_DECLARE_FUNC(js_engine_FileUtils_getOriginalSearchPaths);
SE_DECLARE_FUNC(js_engine_FileUtils_getSearchPaths);
SE_DECLARE_FUNC(js_engine_FileUtils_getStringFromFile);
SE_DECLARE_FUNC(js_engine_FileUtils_getSuitableFOpen);
SE_DECLARE_FUNC(js_engine_FileUtils_getValueMapFromData);
SE_DECLARE_FUNC(js_engine_FileUtils_getValueMapFromFile);
SE_DECLARE_FUNC(js_engine_FileUtils_getValueVectorFromFile);
SE_DECLARE_FUNC(js_engine_FileUtils_getWritablePath);
SE_DECLARE_FUNC(js_engine_FileUtils_isAbsolutePath);
SE_DECLARE_FUNC(js_engine_FileUtils_isDirectoryExist);
SE_DECLARE_FUNC(js_engine_FileUtils_isFileExist);
SE_DECLARE_FUNC(js_engine_FileUtils_listFiles);
SE_DECLARE_FUNC(js_engine_FileUtils_purgeCachedEntries);
SE_DECLARE_FUNC(js_engine_FileUtils_removeDirectory);
SE_DECLARE_FUNC(js_engine_FileUtils_removeFile);
SE_DECLARE_FUNC(js_engine_FileUtils_renameFile);
SE_DECLARE_FUNC(js_engine_FileUtils_setDefaultResourceRootPath);
SE_DECLARE_FUNC(js_engine_FileUtils_setSearchPaths);
SE_DECLARE_FUNC(js_engine_FileUtils_setWritablePath);
SE_DECLARE_FUNC(js_engine_FileUtils_writeDataToFile);
SE_DECLARE_FUNC(js_engine_FileUtils_writeStringToFile);
SE_DECLARE_FUNC(js_engine_FileUtils_writeToFile);
SE_DECLARE_FUNC(js_engine_FileUtils_writeValueMapToFile);
SE_DECLARE_FUNC(js_engine_FileUtils_writeValueVectorToFile);
SE_DECLARE_FUNC(js_engine_FileUtils_getFileDir);
SE_DECLARE_FUNC(js_engine_FileUtils_getInstance);
SE_DECLARE_FUNC(js_engine_FileUtils_normalizePath);

extern se::Object *__jsb_cc_OSInterface_proto; // NOLINT
extern se::Class * __jsb_cc_OSInterface_class; // NOLINT

bool js_register_cc_OSInterface(se::Object *obj); // NOLINT


extern se::Object *__jsb_cc_Vec2_proto; // NOLINT
extern se::Class * __jsb_cc_Vec2_class; // NOLINT

bool js_register_cc_Vec2(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_Vec2_Vec2);

extern se::Object *__jsb_cc_ICanvasGradient_proto; // NOLINT
extern se::Class * __jsb_cc_ICanvasGradient_class; // NOLINT

bool js_register_cc_ICanvasGradient(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_ICanvasGradient_addColorStop);

extern se::Object *__jsb_cc_ICanvasRenderingContext2D_proto; // NOLINT
extern se::Class * __jsb_cc_ICanvasRenderingContext2D_class; // NOLINT

bool js_register_cc_ICanvasRenderingContext2D(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_beginPath);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_clearRect);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_closePath);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_createLinearGradient);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_fill);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_fillImageData);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_fillRect);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_fillText);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_lineTo);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_measureText);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_moveTo);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_rect);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_restore);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_rotate);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_save);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_scale);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_setCanvasBufferUpdatedCallback);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_setTransform);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_stroke);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_strokeText);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_transform);
SE_DECLARE_FUNC(js_engine_ICanvasRenderingContext2D_translate);

extern se::Object *__jsb_cc_CanvasGradient_proto; // NOLINT
extern se::Class * __jsb_cc_CanvasGradient_class; // NOLINT

bool js_register_cc_CanvasGradient(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_CanvasGradient_CanvasGradient);

extern se::Object *__jsb_cc_CanvasRenderingContext2D_proto; // NOLINT
extern se::Class * __jsb_cc_CanvasRenderingContext2D_class; // NOLINT

bool js_register_cc_CanvasRenderingContext2D(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_CanvasRenderingContext2D_CanvasRenderingContext2D);

extern se::Object *__jsb_cc_Device_proto; // NOLINT
extern se::Class * __jsb_cc_Device_class; // NOLINT

bool js_register_cc_Device(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_Device_getBatteryLevel);
SE_DECLARE_FUNC(js_engine_Device_getDPI);
SE_DECLARE_FUNC(js_engine_Device_getDeviceModel);
SE_DECLARE_FUNC(js_engine_Device_getDeviceOrientation);
SE_DECLARE_FUNC(js_engine_Device_getDevicePixelRatio);
SE_DECLARE_FUNC(js_engine_Device_getNetworkType);
SE_DECLARE_FUNC(js_engine_Device_getSafeAreaEdge);
SE_DECLARE_FUNC(js_engine_Device_setAccelerometerEnabled);
SE_DECLARE_FUNC(js_engine_Device_setAccelerometerInterval);
SE_DECLARE_FUNC(js_engine_Device_setKeepScreenOn);
SE_DECLARE_FUNC(js_engine_Device_vibrate);

extern se::Object *__jsb_cc_SAXParser_proto; // NOLINT
extern se::Class * __jsb_cc_SAXParser_class; // NOLINT

bool js_register_cc_SAXParser(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_SAXParser_init);

extern se::Object *__jsb_cc_Color_proto; // NOLINT
extern se::Class * __jsb_cc_Color_class; // NOLINT

bool js_register_cc_Color(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_Color_Color);

extern se::Object *__jsb_cc_CCObject_proto; // NOLINT
extern se::Class * __jsb_cc_CCObject_class; // NOLINT

bool js_register_cc_CCObject(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_engine_CCObject_destroy);
SE_DECLARE_FUNC(js_engine_CCObject_destroyImmediate);
SE_DECLARE_FUNC(js_engine_CCObject_toString);
SE_DECLARE_FUNC(js_engine_CCObject_deferredDestroy);
    // clang-format on