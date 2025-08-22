/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated July 28, 2023. Replaces all prior versions.
 *
 * Copyright (c) 2013-2023, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software or
 * otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE
 * SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#ifndef Spine_PhysicsConstraint_h
#define Spine_PhysicsConstraint_h

#include <spine/ConstraintData.h>

#include <spine/Vector.h>

namespace spine {
	class PhysicsConstraintData;

	class Skeleton;

	class Bone;

    class SP_API PhysicsConstraint : public Updatable {

        friend class Skeleton;

        friend class PhysicsConstraintTimeline;

        friend class PhysicsConstraintInertiaTimeline;

        friend class PhysicsConstraintStrengthTimeline;

        friend class PhysicsConstraintDampingTimeline;

        friend class PhysicsConstraintMassTimeline;

        friend class PhysicsConstraintWindTimeline;

        friend class PhysicsConstraintGravityTimeline;

        friend class PhysicsConstraintMixTimeline;

        friend class PhysicsConstraintResetTimeline;

    RTTI_DECL

    public:
        PhysicsConstraint(PhysicsConstraintData& data, Skeleton& skeleton);

        PhysicsConstraintData &getData();

        void setBone(Bone* bone);
        Bone* getBone();

        void setInertia(float value);
        float getInertia();

        void setStrength(float value);
        float getStrength();

        void setDamping(float value);
        float getDamping();

        void setMassInverse(float value);
        float getMassInverse();

        void setWind(float value);
        float getWind();

        void setGravity(float value);
        float getGravity();

        void setMix(float value);
        float getMix();

        void setReset(bool value);
        bool getReset();

        void setUx(float value);
        float getUx();

        void setUy(float value);
        float getUy();

        void setCx(float value);
        float getCx();

        void setCy(float value);
        float getCy();

        void setTx(float value);
        float getTx();

        void setTy(float value);
        float getTy();

        void setXOffset(float value);
        float getXOffset();

        void setXVelocity(float value);
        float getXVelocity();

        void setYOffset(float value);
        float getYOffset();

        void setYVelocity(float value);
        float getYVelocity();

        void setRotateOffset(float value);
        float getRotateOffset();

        void setRotateVelocity(float value);
        float getRotateVelocity();

        void setScaleOffset(float value);
        float getScaleOffset();

        void setScaleVelocity(float value);
        float getScaleVelocity();

        void setActive(bool value);
        bool isActive();

        void setRemaining(float value);
        float getRemaining();

        void setLastTime(float value);
        float getLastTime();

        void reset();

        void setToSetupPose();

        virtual void update(Physics physics);

        void translate(float x, float y);

        void rotate(float x, float y, float degrees);

    private:
        PhysicsConstraintData& _data;
        Bone* _bone;

        float _inertia;
        float _strength;
        float _damping;
        float _massInverse;
        float _wind;
        float _gravity;
        float _mix;

        bool _reset;
        float _ux;
        float _uy;
        float _cx;
        float _cy;
        float _tx;
        float _ty;
        float _xOffset;
        float _xVelocity;
        float _yOffset;
        float _yVelocity;
        float _rotateOffset;
        float _rotateVelocity;
        float _scaleOffset;
        float _scaleVelocity;

        bool _active;

        Skeleton& _skeleton;
        float _remaining;
        float _lastTime;
    };
}

#endif /* Spine_PhysicsConstraint_h */
