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

#ifndef Spine_TransformConstraintTimeline_h
#define Spine_TransformConstraintTimeline_h

#include <spine/CurveTimeline.h>

namespace spine {

	class SP_API TransformConstraintTimeline : public CurveTimeline {
		friend class SkeletonBinary;

		friend class SkeletonJson;

	RTTI_DECL

	public:
		explicit TransformConstraintTimeline(size_t frameCount, size_t bezierCount, int transformConstraintIndex);

		virtual void
		apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
			  MixDirection direction);

		void setFrame(size_t frameIndex, float time, float mixRotate, float mixX, float mixY, float mixScaleX,
					  float mixScaleY, float mixShearY);

		int getTransformConstraintIndex() { return _constraintIndex; }

		void setTransformConstraintIndex(int inValue) { _constraintIndex = inValue; }
    #ifndef __EMSCRIPTEN__
	private:
	#endif
		int _constraintIndex;

		static const int ENTRIES = 7;
		static const int ROTATE = 1;
		static const int X = 2;
		static const int Y = 3;
		static const int SCALEX = 4;
		static const int SCALEY = 5;
		static const int SHEARY = 6;
	};
}

#endif /* Spine_TransformConstraintTimeline_h */
