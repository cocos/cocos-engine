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
#include "base/std/container/unordered_map.h"
#include "core/scene-graph/Node.h"
#include "physics/physx/PhysXInc.h"
#include "physics/spec/IBody.h"

namespace cc {

namespace physics {

class PhysXWorld;
class PhysXShape;
class PhysXJoint;
class PhysXRigidBody;

class PhysXSharedBody final {
public:
    static PhysXSharedBody *getSharedBody(const Node *node, PhysXWorld *world, PhysXRigidBody *body);
    PhysXSharedBody() = delete;
    PhysXSharedBody(const PhysXSharedBody &other) = delete;
    PhysXSharedBody(PhysXSharedBody &&other) = delete;
    void reference(bool v);
    void enabled(bool v);
    inline bool isInWorld() { return _mIndex >= 0; }
    inline bool isStatic() { return static_cast<int>(_mType) & static_cast<int>(ERigidBodyType::STATIC); }
    inline bool isKinematic() { return static_cast<int>(_mType) & static_cast<int>(ERigidBodyType::KINEMATIC); }
    inline bool isStaticOrKinematic() { return static_cast<int>(_mType) & static_cast<int>(ERigidBodyType::STATIC) || static_cast<int>(_mType) & static_cast<int>(ERigidBodyType::KINEMATIC); }
    inline bool isDynamic() { return !isStaticOrKinematic(); }
    inline Node *getNode() const { return _mNode; }
    inline PhysXWorld &getWorld() const { return *_mWrappedWorld; }
    union UActor {
        uintptr_t ptr;
        physx::PxRigidActor *rigidActor;
        physx::PxRigidStatic *rigidStatic;
        physx::PxRigidDynamic *rigidDynamic;
    };
    UActor getImpl();
    void setType(ERigidBodyType v);
    void setMass(float v);
    void syncScale();
    void syncSceneToPhysics();
    void syncSceneWithCheck();
    void syncPhysicsToScene();
    void addShape(const PhysXShape &shape);
    void removeShape(const PhysXShape &shape);
    void addJoint(const PhysXJoint &joint, physx::PxJointActorIndex::Enum index);
    void removeJoint(const PhysXJoint &joint, physx::PxJointActorIndex::Enum index);
    void setCollisionFilter(const physx::PxFilterData &data);
    void clearForces();
    void clearVelocity();
    void setGroup(uint32_t v);
    void setMask(uint32_t v);
    inline uint32_t getGroup() const { return _mFilterData.word0; }
    inline uint32_t getMask() const { return _mFilterData.word1; }

private:
    static ccstd::unordered_map<Node *, PhysXSharedBody *> sharedBodesMap;
    const uint32_t _mID;
    uint8_t _mRef;
    bool _mIsStatic;
    ERigidBodyType _mType;
    float _mMass;
    int _mIndex;
    physx::PxFilterData _mFilterData;
    Node *_mNode;
    UActor _mImpl;
    physx::PxRigidStatic *_mStaticActor;
    physx::PxRigidDynamic *_mDynamicActor;
    PhysXWorld *_mWrappedWorld;
    PhysXRigidBody *_mWrappedBody;
    ccstd::vector<PhysXShape *> _mWrappedShapes;
    ccstd::vector<PhysXJoint *> _mWrappedJoints0;
    ccstd::vector<PhysXJoint *> _mWrappedJoints1;
    PhysXSharedBody(Node *node, PhysXWorld *world, PhysXRigidBody *body);
    ~PhysXSharedBody();
    void initActor();
    void switchActor(bool isStaticBefore);
    void initStaticActor();
    void initDynamicActor();
};

} // namespace physics
} // namespace cc
