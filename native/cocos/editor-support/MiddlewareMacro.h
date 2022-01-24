/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
// index buffer init capacity
#define INIT_INDEX_BUFFER_SIZE 1024000
// max vertex buffer size
#define MAX_VERTEX_BUFFER_SIZE 65535
// render info int capacity
#define INIT_RENDER_INFO_BUFFER_SIZE 1024000

// fill debug data max capacity
#define MAX_DEBUG_BUFFER_SIZE 409600
// type array pool min size
#define MIN_TYPE_ARRAY_SIZE 1024

#ifndef MIDDLEWARE_BEGIN
#define MIDDLEWARE_BEGIN namespace cc { namespace middleware {
#endif // MIDDLEWARE_BEGIN

#ifndef MIDDLEWARE_END
#define MIDDLEWARE_END }}
#endif // MIDDLEWARE_END

#ifndef USING_NS_MW
#define USING_NS_MW using namespace cc::middleware
#endif

// R G B A �ֱ�ռ��32λ
#define VF_XYZUVC 9
#define VF_XYZUVCC 13
