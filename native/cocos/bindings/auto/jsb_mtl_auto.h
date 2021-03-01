/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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
#include "cocos/renderer/gfx-metal/GFXMTL.h"

extern se::Object* __jsb_cc_gfx_CCMTLDevice_proto;
extern se::Class* __jsb_cc_gfx_CCMTLDevice_class;

bool js_register_cc_gfx_CCMTLDevice(se::Object* obj);
bool register_all_mtl(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::CCMTLDevice);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_disposeCurrentDrawable);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getCurrentDrawable);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getDSSTexture);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_getMTLLayer);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_onPresentCompleted);
SE_DECLARE_FUNC(js_mtl_CCMTLDevice_CCMTLDevice);

