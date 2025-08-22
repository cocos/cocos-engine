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

#ifndef Spine_CurveTimeline_h
#define Spine_CurveTimeline_h

#include <spine/Timeline.h>
#include <spine/Vector.h>

namespace spine {
	/// Base class for frames that use an interpolation bezier curve.
	class SP_API CurveTimeline : public Timeline {
	RTTI_DECL

	public:
		explicit CurveTimeline(size_t frameCount, size_t frameEntries, size_t bezierCount);

		virtual ~CurveTimeline();

		void setLinear(size_t frame);

		void setStepped(size_t frame);

		virtual void
		setBezier(size_t bezier, size_t frame, float value, float time1, float value1, float cx1, float cy1, float cx2,
				  float cy2, float time2, float value2);

		float getBezierValue(float time, size_t frame, size_t valueOffset, size_t i);

		Vector<float> &getCurves();
		
    #ifndef __EMSCRIPTEN__
	protected:
	#endif
		static const int LINEAR = 0;
		static const int STEPPED = 1;
		static const int BEZIER = 2;
		static const int BEZIER_SIZE = 18;

		Vector<float> _curves; // type, x, y, ...
	};

	class SP_API CurveTimeline1 : public CurveTimeline {
	RTTI_DECL

	public:
		explicit CurveTimeline1(size_t frameCount, size_t bezierCount);

		virtual ~CurveTimeline1();

		void setFrame(size_t frame, float time, float value);

		float getCurveValue(float time);

        float getRelativeValue(float time, float alpha, MixBlend blend, float current, float setup);

        float getAbsoluteValue(float time, float alpha, MixBlend blend, float current, float setup);

        float getAbsoluteValue (float time, float alpha, MixBlend blend, float current, float setup, float value);

        float getScaleValue (float time, float alpha, MixBlend blend, MixDirection direction, float current, float setup);
    #ifndef __EMSCRIPTEN__
	protected:
	#endif
		static const int ENTRIES = 2;
		static const int VALUE = 1;
	};

	class SP_API CurveTimeline2 : public CurveTimeline {
	RTTI_DECL

	public:
		explicit CurveTimeline2(size_t frameCount, size_t bezierCount);

		virtual ~CurveTimeline2();

		void setFrame(size_t frame, float time, float value1, float value2);

	#ifndef __EMSCRIPTEN__
	protected:
	#endif
		static const int ENTRIES = 3;
		static const int VALUE1 = 1;
		static const int VALUE2 = 2;
	};
}

#endif /* Spine_CurveTimeline_h */
