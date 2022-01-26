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

#include <cstdint>
#include "core/scene-graph/Node.h"
#include "physics/spec/ILifecycle.h"

namespace cc {
namespace physics {

class IBaseJoint : virtual public ILifecycle {
public:
    ~IBaseJoint() override                          = default;
    virtual void      initialize(Node *node)        = 0;
    virtual uintptr_t getImpl()                     = 0;
    virtual void      setEnableCollision(bool v)    = 0;
    virtual void      setConnectedBody(uintptr_t v) = 0;
};

class IDistanceJoint : virtual public IBaseJoint {
public:
    ~IDistanceJoint() override                        = default;
    virtual void setPivotA(float x, float y, float z) = 0;
    virtual void setPivotB(float x, float y, float z) = 0;
};

class IRevoluteJoint : virtual public IBaseJoint {
public:
    ~IRevoluteJoint() override                        = default;
    virtual void setPivotA(float x, float y, float z) = 0;
    virtual void setPivotB(float x, float y, float z) = 0;
    virtual void setAxis(float x, float y, float z)   = 0;
};

} // namespace physics
} // namespace cc
