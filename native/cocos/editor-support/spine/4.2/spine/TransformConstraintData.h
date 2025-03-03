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

#ifndef Spine_TransformConstraintData_h
#define Spine_TransformConstraintData_h

#include <spine/Vector.h>
#include <spine/SpineObject.h>
#include <spine/SpineString.h>
#include <spine/ConstraintData.h>

namespace spine {
	class BoneData;

	class SP_API TransformConstraintData : public ConstraintData {
		friend class SkeletonBinary;

		friend class SkeletonJson;

		friend class TransformConstraint;

		friend class Skeleton;

		friend class TransformConstraintTimeline;

	public:
		RTTI_DECL

		explicit TransformConstraintData(const String &name);

		Vector<BoneData *> &getBones();

		BoneData *getTarget();

        void setTarget(BoneData *target);

		float getMixRotate();

        void setMixRotate(float mixRotate);

		float getMixX();

        void setMixX(float mixX);

		float getMixY();

        void setMixY(float mixY);

		float getMixScaleX();

        void setMixScaleX(float mixScaleX);

		float getMixScaleY();

        void setMixScaleY(float mixScaleY);

		float getMixShearY();

        void setMixShearY(float mixShearY);

		float getOffsetRotation();

        void setOffsetRotation(float offsetRotation);

		float getOffsetX();

        void setOffsetX(float offsetX);

		float getOffsetY();

        void setOffsetY(float offsetY);

		float getOffsetScaleX();

        void setOffsetScaleX(float offsetScaleX);

		float getOffsetScaleY();

        void setOffsetScaleY(float offsetScaleY);

		float getOffsetShearY();

        void setOffsetShearY(float offsetShearY);

		bool isRelative();

        void setRelative(bool isRelative);

		bool isLocal();

        void setLocal(bool isLocal);

	private:
		Vector<BoneData *> _bones;
		BoneData *_target;
		float _mixRotate, _mixX, _mixY, _mixScaleX, _mixScaleY, _mixShearY;
		float _offsetRotation, _offsetX, _offsetY, _offsetScaleX, _offsetScaleY, _offsetShearY;
		bool _relative, _local;
	};
}

#endif /* Spine_TransformConstraintData_h */
