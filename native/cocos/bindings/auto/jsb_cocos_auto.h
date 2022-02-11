/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

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

extern se::Object* __jsb_cc_FileUtils_proto;
extern se::Class* __jsb_cc_FileUtils_class;

bool js_register_cc_FileUtils(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::FileUtils);
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
SE_DECLARE_FUNC(js_engine_FileUtils_getInstance);
SE_DECLARE_FUNC(js_engine_FileUtils_setDelegate);
SE_DECLARE_FUNC(js_engine_FileUtils_normalizePath);
SE_DECLARE_FUNC(js_engine_FileUtils_getFileDir);

extern se::Object* __jsb_cc_OSInterface_proto;
extern se::Class* __jsb_cc_OSInterface_class;

bool js_register_cc_OSInterface(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::OSInterface);

extern se::Object* __jsb_cc_ICanvasGradient_proto;
extern se::Class* __jsb_cc_ICanvasGradient_class;

bool js_register_cc_ICanvasGradient(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::ICanvasGradient);
SE_DECLARE_FUNC(js_engine_ICanvasGradient_addColorStop);

extern se::Object* __jsb_cc_ICanvasRenderingContext2D_proto;
extern se::Class* __jsb_cc_ICanvasRenderingContext2D_class;

bool js_register_cc_ICanvasRenderingContext2D(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::ICanvasRenderingContext2D);
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

extern se::Object* __jsb_cc_CanvasGradient_proto;
extern se::Class* __jsb_cc_CanvasGradient_class;

bool js_register_cc_CanvasGradient(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::CanvasGradient);
SE_DECLARE_FUNC(js_engine_CanvasGradient_CanvasGradient);

extern se::Object* __jsb_cc_CanvasRenderingContext2D_proto;
extern se::Class* __jsb_cc_CanvasRenderingContext2D_class;

bool js_register_cc_CanvasRenderingContext2D(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::CanvasRenderingContext2D);
SE_DECLARE_FUNC(js_engine_CanvasRenderingContext2D_CanvasRenderingContext2D);

extern se::Object* __jsb_cc_Device_proto;
extern se::Class* __jsb_cc_Device_class;

bool js_register_cc_Device(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::Device);
SE_DECLARE_FUNC(js_engine_Device_getDPI);
SE_DECLARE_FUNC(js_engine_Device_getDevicePixelRatio);
SE_DECLARE_FUNC(js_engine_Device_setAccelerometerEnabled);
SE_DECLARE_FUNC(js_engine_Device_setAccelerometerInterval);
SE_DECLARE_FUNC(js_engine_Device_getDeviceOrientation);
SE_DECLARE_FUNC(js_engine_Device_getDeviceModel);
SE_DECLARE_FUNC(js_engine_Device_setKeepScreenOn);
SE_DECLARE_FUNC(js_engine_Device_vibrate);
SE_DECLARE_FUNC(js_engine_Device_getBatteryLevel);
SE_DECLARE_FUNC(js_engine_Device_getNetworkType);
SE_DECLARE_FUNC(js_engine_Device_getSafeAreaEdge);

extern se::Object* __jsb_cc_SAXParser_proto;
extern se::Class* __jsb_cc_SAXParser_class;

bool js_register_cc_SAXParser(se::Object* obj);
bool register_all_engine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::SAXParser);
SE_DECLARE_FUNC(js_engine_SAXParser_init);

