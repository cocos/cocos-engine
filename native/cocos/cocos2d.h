/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/

#ifndef __COCOS2D_H__
#define __COCOS2D_H__

// 0x00 HI ME LO
// 00   03 08 00
#define COCOS2D_VERSION 0x00031300

//
// all cocos2d include files
//
#include "base/Config.h"

// base
#include "base/AutoreleasePool.h"
#include "base/Data.h"
#include "base/Map.h"
#include "base/Ref.h"
#include "base/Value.h"
#include "base/Vector.h"
#include "base/ZipUtils.h"
#include "base/base64.h"
#include "base/Config.h"
#include "base/Macros.h"
#include "base/UTF8.h"
#include "base/Utils.h"
#include "base/job-system/JobSystem.h"


// math
#include "math/Geometry.h"
#include "math/Vertex.h"
#include "math/Mat4.h"
#include "math/MathUtil.h"
#include "math/Quaternion.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"


// include

// renderer

// platform
#include "platform/Device.h"
#include "platform/FileUtils.h"
#include "platform/Image.h"
#include "base/Macros.h"
#include "platform/SAXParser.h"
#include "platform/CanvasRenderingContext2D.h"

namespace cc {

CC_DLL const char* cocos2dVersion();

}

#endif // __COCOS2D_H__
