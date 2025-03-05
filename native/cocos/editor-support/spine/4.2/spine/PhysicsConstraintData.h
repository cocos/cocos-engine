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

#ifndef Spine_PhysicsConstraintData_h
#define Spine_PhysicsConstraintData_h

#include <spine/Vector.h>
#include <spine/SpineObject.h>
#include <spine/SpineString.h>
#include <spine/ConstraintData.h>

namespace spine {
	class BoneData;

	class SP_API PhysicsConstraintData : public ConstraintData {
		friend class SkeletonBinary;

		friend class SkeletonJson;

		friend class Skeleton;

        friend class PhysicsConstraint;

	public:
		RTTI_DECL

		explicit PhysicsConstraintData(const String &name);

        void setBone(BoneData* bone);

        BoneData* getBone() const;

        void setX(float x);

        float getX() const;

        void setY(float y);

        float getY() const;

        void setRotate(float rotate);

        float getRotate() const;

        void setScaleX(float scaleX);

        float getScaleX() const;

        void setShearX(float shearX);

        float getShearX() const;

        void setLimit(float limit);

        float getLimit() const;

        void setStep(float step);

        float getStep() const;

        void setInertia(float inertia);

        float getInertia() const;

        void setStrength(float strength);

        float getStrength() const;

        void setDamping(float damping);

        float getDamping() const;

        void setMassInverse(float massInverse);

        float getMassInverse() const;

        void setWind(float wind);

        float getWind() const;

        void setGravity(float gravity);

        float getGravity() const;

        void setMix(float mix);

        float getMix() const;

        void setInertiaGlobal(bool inertiaGlobal);

        bool isInertiaGlobal() const;

        void setStrengthGlobal(bool strengthGlobal);

        bool isStrengthGlobal() const;

        void setDampingGlobal(bool dampingGlobal);

        bool isDampingGlobal() const;

        void setMassGlobal(bool massGlobal);

        bool isMassGlobal() const;

        void setWindGlobal(bool windGlobal);

        bool isWindGlobal() const;

        void setGravityGlobal(bool gravityGlobal);

        bool isGravityGlobal() const;

        void setMixGlobal(bool mixGlobal);

        bool isMixGlobal() const;

	private:
		BoneData *_bone;
        float _x, _y, _rotate, _scaleX, _shearX, _limit;
        float _step, _inertia, _strength, _damping, _massInverse, _wind, _gravity, _mix;
        bool _inertiaGlobal, _strengthGlobal, _dampingGlobal, _massGlobal, _windGlobal, _gravityGlobal, _mixGlobal;
	};
}

#endif /* Spine_PhysicsConstraintData_h */
