/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#pragma once

#include "base/Macros.h"
#include "core/scene-graph/Node.h"
#include "physics/physx/PhysXInc.h"
#include "physics/spec/IJoint.h"

namespace cc {
namespace physics {
class PhysXSharedBody;

class PhysXJoint : virtual public IBaseJoint {
    PX_NOCOPY(PhysXJoint)

public:
    PhysXJoint();
    ~PhysXJoint() override = default;
    void initialize(Node *node) override;
    void onEnable() override;
    void onDisable() override;
    void onDestroy() override;
    void setConnectedBody(uint32_t rigidBodyID) override;
    void setEnableCollision(bool v) override;
    void setEnableDebugVisualization(bool v);
    virtual void updateScale0() = 0;
    virtual void updateScale1() = 0;
    static physx::PxRigidActor &getTempRigidActor();
    static void releaseTempRigidActor();
    uint32_t getObjectID() const override { return _mObjectID; };

protected:
    physx::PxJoint *_mJoint{nullptr};
    PhysXSharedBody *_mSharedBody{nullptr};
    PhysXSharedBody *_mConnectedBody{nullptr};
    bool _mEnableCollision{false};
    bool _mEnableDebugVisualization{ false };
    virtual void onComponentSet() = 0;
    uint32_t _mObjectID{0};

private:
    static physx::PxRigidActor *tempRigidActor;
};

} // namespace physics
} // namespace cc
