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

#ifndef Spine_PhysicsConstraintTimeline_h
#define Spine_PhysicsConstraintTimeline_h

#include <spine/CurveTimeline.h>
#include <spine/PhysicsConstraint.h>
#include <spine/PhysicsConstraintData.h>

namespace spine {

	class SP_API PhysicsConstraintTimeline : public CurveTimeline1 {
		friend class SkeletonBinary;

		friend class SkeletonJson;

	RTTI_DECL

	public:
		explicit PhysicsConstraintTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex, Property property);

		virtual void
		apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
			  MixDirection direction);

		int getPhysicsConstraintIndex() { return _constraintIndex; }

		void setPhysicsConstraintIndex(int inValue) { _constraintIndex = inValue; }

    protected:
        virtual float setup(PhysicsConstraint *constraint) = 0;
        virtual float get(PhysicsConstraint *constraint) = 0;
        virtual void set(PhysicsConstraint *constraint, float value) = 0;
        virtual bool global(PhysicsConstraintData &constraintData) = 0;

	private:
		int _constraintIndex;
	};

    class SP_API PhysicsConstraintInertiaTimeline : public PhysicsConstraintTimeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintInertiaTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex): PhysicsConstraintTimeline(frameCount, bezierCount, physicsConstraintIndex, Property_PhysicsConstraintInertia) {};

    protected:
        float setup(PhysicsConstraint *constraint) {
            return constraint->_data.getInertia();
        }

        float get(PhysicsConstraint *constraint) {
            return constraint->_inertia;
        }

        void set(PhysicsConstraint *constraint, float value) {
            constraint->_inertia = value;
        }

        bool global(PhysicsConstraintData &constraintData) {
            return constraintData.isInertiaGlobal();
        }
    };

    class SP_API PhysicsConstraintStrengthTimeline : public PhysicsConstraintTimeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintStrengthTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex): PhysicsConstraintTimeline(frameCount, bezierCount, physicsConstraintIndex, Property_PhysicsConstraintStrength) {};

    protected:
        float setup(PhysicsConstraint *constraint) {
            return constraint->_data.getStrength();
        }

        float get(PhysicsConstraint *constraint) {
            return constraint->_strength;
        }

        void set(PhysicsConstraint *constraint, float value) {
            constraint->_strength = value;
        }

        bool global(PhysicsConstraintData &constraintData) {
            return constraintData.isStrengthGlobal();
        }
    };

    class SP_API PhysicsConstraintDampingTimeline : public PhysicsConstraintTimeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintDampingTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex): PhysicsConstraintTimeline(frameCount, bezierCount, physicsConstraintIndex, Property_PhysicsConstraintDamping) {};

    protected:
        float setup(PhysicsConstraint *constraint) {
            return constraint->_data.getDamping();
        }

        float get(PhysicsConstraint *constraint) {
            return constraint->_damping;
        }

        void set(PhysicsConstraint *constraint, float value) {
            constraint->_damping = value;
        }

        bool global(PhysicsConstraintData &constraintData) {
            return constraintData.isDampingGlobal();
        }
    };

    class SP_API PhysicsConstraintMassTimeline : public PhysicsConstraintTimeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintMassTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex): PhysicsConstraintTimeline(frameCount, bezierCount, physicsConstraintIndex, Property_PhysicsConstraintMass) {};

    protected:
        float setup(PhysicsConstraint *constraint) {
            return 1 / constraint->_data.getMassInverse();
        }

        float get(PhysicsConstraint *constraint) {
            return 1 / constraint->_massInverse;
        }

        void set(PhysicsConstraint *constraint, float value) {
            constraint->_massInverse = 1 / value;
        }

        bool global(PhysicsConstraintData &constraintData) {
            return constraintData.isMassGlobal();
        }
    };

    class SP_API PhysicsConstraintWindTimeline : public PhysicsConstraintTimeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintWindTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex): PhysicsConstraintTimeline(frameCount, bezierCount, physicsConstraintIndex, Property_PhysicsConstraintWind) {};

    protected:
        float setup(PhysicsConstraint *constraint) {
            return constraint->_data.getWind();
        }

        float get(PhysicsConstraint *constraint) {
            return constraint->_wind;
        }

        void set(PhysicsConstraint *constraint, float value) {
            constraint->_wind = value;
        }

        bool global(PhysicsConstraintData &constraintData) {
            return constraintData.isWindGlobal();
        }
    };

    class SP_API PhysicsConstraintGravityTimeline : public PhysicsConstraintTimeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintGravityTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex): PhysicsConstraintTimeline(frameCount, bezierCount, physicsConstraintIndex, Property_PhysicsConstraintGravity) {};

    protected:
        float setup(PhysicsConstraint *constraint) {
            return constraint->_data.getGravity();
        }

        float get(PhysicsConstraint *constraint) {
            return constraint->_gravity;
        }

        void set(PhysicsConstraint *constraint, float value) {
            constraint->_gravity = value;
        }

        bool global(PhysicsConstraintData &constraintData) {
            return constraintData.isGravityGlobal();
        }
    };

    class SP_API PhysicsConstraintMixTimeline : public PhysicsConstraintTimeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintMixTimeline(size_t frameCount, size_t bezierCount, int physicsConstraintIndex): PhysicsConstraintTimeline(frameCount, bezierCount, physicsConstraintIndex, Property_PhysicsConstraintMix) {};

    protected:
        float setup(PhysicsConstraint *constraint) {
            return constraint->_data.getMix();
        }

        float get(PhysicsConstraint *constraint) {
            return constraint->_mix;
        }

        void set(PhysicsConstraint *constraint, float value) {
            constraint->_mix = value;
        }

        bool global(PhysicsConstraintData &constraintData) {
            return constraintData.isMixGlobal();
        }
    };

    class SP_API PhysicsConstraintResetTimeline : public Timeline {
        friend class SkeletonBinary;

        friend class SkeletonJson;

    RTTI_DECL

    public:
        explicit PhysicsConstraintResetTimeline(size_t frameCount, int physicsConstraintIndex): Timeline(frameCount, 1), _constraintIndex(physicsConstraintIndex) {
            PropertyId ids[] = {((PropertyId)Property_PhysicsConstraintReset) << 32};
            setPropertyIds(ids, 1);
        }

        virtual void
        apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
              MixDirection direction);

        void setFrame(int frame, float time) {
            _frames[frame] = time;
        }
    private:
        int _constraintIndex;
    };
}

#endif /* Spine_PhysicsConstraintTimeline_h */
