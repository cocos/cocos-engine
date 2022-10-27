/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.
 
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
#ifdef SWIGCOCOS
#define IMPL_EVENT_TARGET_WITH_PARENT(...)
#define IMPL_EVENT_TARGET(...)
#define DECLARE_TARGET_EVENT0(...)
#define DECLARE_TARGET_EVENT1(...)
#define DECLARE_TARGET_EVENT2(...)
#define DECLARE_TARGET_EVENT3(...)
#define DECLARE_TARGET_EVENT4(...)
#define DECLARE_TARGET_EVENT5(...)
#define DECLARE_TARGET_EVENT6(...)
#define DECLARE_TARGET_EVENT7(...)
#define DECLARE_TARGET_EVENT8(...)
#define DECLARE_TARGET_EVENT9(...)
#define DECLARE_TARGET_EVENT10(...)
#define DECLARE_TARGET_EVENT11(...)
#define DECLARE_TARGET_EVENT12(...)
#define DECLARE_TARGET_EVENT13(...)
#define DECLARE_TARGET_EVENT14(...)
#define DECLARE_TARGET_EVENT15(...)
#define DECLARE_TARGET_EVENT16(...)
#define DECLARE_TARGET_EVENT17(...)
#define DECLARE_TARGET_EVENT18(...)
#define DECLARE_TARGET_EVENT19(...)
#define DECLARE_TARGET_EVENT20(...)
#else
#include "EventBus.h"
#include "EventTarget.h"
#endif