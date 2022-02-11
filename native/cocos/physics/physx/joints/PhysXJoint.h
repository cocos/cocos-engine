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

#include "base/Macros.h"
#include "physics/physx/PhysXInc.h"
#include "physics/spec/IJoint.h"
#include "scene/Node.h"

namespace cc {
namespace physics {
class PhysXSharedBody;

class PhysXJoint : virtual public IBaseJoint {
    PX_NOCOPY(PhysXJoint)
    PhysXJoint() = default;

public:
    ~PhysXJoint() override = default;
    inline uintptr_t            getImpl() override { return reinterpret_cast<uintptr_t>(this); }
    void                        initialize(scene::Node *node) override;
    void                        onEnable() override;
    void                        onDisable() override;
    void                        onDestroy() override;
    void                        setConnectedBody(uintptr_t v) override;
    void                        setEnableCollision(bool v) override;
    virtual void                updateScale0() = 0;
    virtual void                updateScale1() = 0;
    static physx::PxRigidActor &getTempRigidActor();
    static void                 releaseTempRigidActor();

protected:
    physx::PxJoint * _mJoint{nullptr};
    PhysXSharedBody *_mSharedBody{nullptr};
    PhysXSharedBody *_mConnectedBody{nullptr};
    bool             _mEnableCollision{false};
    virtual void     onComponentSet() = 0;

private:
    static physx::PxRigidActor *tempRigidActor;
};

} // namespace physics
} // namespace cc
