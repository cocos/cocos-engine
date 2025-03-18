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

#ifndef Spine_Animation_h
#define Spine_Animation_h

#include <spine/Vector.h>
#include <spine/HashMap.h>
#include <spine/MixBlend.h>
#include <spine/MixDirection.h>
#include <spine/SpineObject.h>
#include <spine/SpineString.h>
#include <spine/Property.h>

namespace spine {
	class Timeline;

	class Skeleton;

	class Event;

	class AnimationState;

	class SP_API Animation : public SpineObject {
		friend class AnimationState;

		friend class TrackEntry;

		friend class AnimationStateData;

		friend class AttachmentTimeline;

		friend class RGBATimeline;

		friend class RGBTimeline;

		friend class AlphaTimeline;

		friend class RGBA2Timeline;

		friend class RGB2Timeline;

		friend class DeformTimeline;

		friend class DrawOrderTimeline;

		friend class EventTimeline;

		friend class IkConstraintTimeline;

		friend class PathConstraintMixTimeline;

		friend class PathConstraintPositionTimeline;

		friend class PathConstraintSpacingTimeline;

		friend class RotateTimeline;

		friend class ScaleTimeline;

		friend class ShearTimeline;

		friend class TransformConstraintTimeline;

		friend class TranslateTimeline;

		friend class TranslateXTimeline;

		friend class TranslateYTimeline;

		friend class TwoColorTimeline;

	public:
		Animation(const String &name, Vector<Timeline *> &timelines, float duration);

		~Animation();

		/// Applies all the animation's timelines to the specified skeleton.
		/// See also Timeline::apply(Skeleton&, float, float, Vector, float, MixPose, MixDirection)
		void apply(Skeleton &skeleton, float lastTime, float time, bool loop, Vector<Event *> *pEvents, float alpha,
				   MixBlend blend, MixDirection direction);

		const String &getName();

		Vector<Timeline *> &getTimelines();

		bool hasTimeline(Vector<PropertyId> &ids);

		float getDuration();

		void setDuration(float inValue);

		/// @param target After the first and before the last entry.
		static int search(Vector<float> &values, float target);

		static int search(Vector<float> &values, float target, int step);
	#ifndef __EMSCRIPTEN__
	private:
	#endif
		Vector<Timeline *> _timelines;
		HashMap<PropertyId, bool> _timelineIds;
		float _duration;
		String _name;
	};
}

#endif /* Spine_Animation_h */
