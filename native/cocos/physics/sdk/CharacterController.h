/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include <memory>
#include "base/Macros.h"
#include "core/scene-graph/Node.h"
#include "physics/spec/IShape.h"
#include "physics/spec/ICharacterController.h"

#define CC_PHYSICS_CCT_CLASS(CLASS)                                     \
    class CC_DLL CLASS final : public I##CLASS {                        \
    protected:                                                          \
        std::unique_ptr<I##CLASS> _impl;                                \
                                                                        \
    public:                                                             \
        CLASS();                                                        \
        ~CLASS() override;                                              \
        bool initialize(Node *node) override;                           \
        void onEnable() override;                                       \
        void onDisable() override;                                      \
        void onDestroy() override;                                      \
        virtual cc::Vec3 getPosition() override;                        \
        virtual void setPosition(float x, float y, float z) override;   \
        virtual bool onGround() override;                               \
        virtual void move(float x, float y, float z, float minDist,     \
        float elapsedTime) override;                                    \
        void syncPhysicsToScene() override;                             \
        virtual void setStepOffset(float v) override;                   \
        virtual float getStepOffset() override;                         \
        virtual void setSlopeLimit(float v) override;                   \
        virtual float getSlopeLimit() override;                         \
        virtual void setContactOffset(float v) override;                \
        virtual float getContactOffset()  override;                     \
        virtual void setDetectCollisions(bool v) override;              \
        virtual void setOverlapRecovery(bool v) override;               \
        virtual void setCenter(float x, float y, float z) override;     \
        uint32_t getGroup() override;                                   \
        void setGroup(uint32_t g) override;                             \
        uint32_t getMask() override;                                    \
        void setMask(uint32_t m) override;                              \
        void updateEventListener(EShapeFilterFlag flag) override;       \
        uint32_t getObjectID() const override;

namespace cc {
namespace physics {
        CC_PHYSICS_CCT_CLASS(CapsuleCharacterController)
        void setRadius(float v) override;
        void setHeight(float v) override;
        };

        CC_PHYSICS_CCT_CLASS(BoxCharacterController)
        void setHalfHeight(float v) override;
        void setHalfSideExtent(float v) override;
        void setHalfForwardExtent(float v) override;
};
}; // namespace physics
} // namespace cc
