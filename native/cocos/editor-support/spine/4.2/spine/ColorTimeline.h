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

#ifndef Spine_ColorTimeline_h
#define Spine_ColorTimeline_h

#include <spine/CurveTimeline.h>

namespace spine {
	class SP_API RGBATimeline : public CurveTimeline {
		friend class SkeletonBinary;

		friend class SkeletonJson;

	RTTI_DECL

	public:
		explicit RGBATimeline(size_t frameCount, size_t bezierCount, int slotIndex);

		virtual ~RGBATimeline();

		virtual void
		apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
			  MixDirection direction);

		/// Sets the time and value of the specified keyframe.
		void setFrame(int frame, float time, float r, float g, float b, float a);

		int getSlotIndex() { return _slotIndex; };

		void setSlotIndex(int inValue) { _slotIndex = inValue; }
    #ifndef __EMSCRIPTEN__
	protected:
	#endif
		int _slotIndex;

		static const int ENTRIES;
		static const int R = 1;
		static const int G = 2;
		static const int B = 3;
		static const int A = 4;
	};

	class SP_API RGBTimeline : public CurveTimeline {
		friend class SkeletonBinary;

		friend class SkeletonJson;

	RTTI_DECL

	public:
		explicit RGBTimeline(size_t frameCount, size_t bezierCount, int slotIndex);

		virtual ~RGBTimeline();

		virtual void
		apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
			  MixDirection direction);

		/// Sets the time and value of the specified keyframe.
		void setFrame(int frame, float time, float r, float g, float b);

		int getSlotIndex() { return _slotIndex; };

		void setSlotIndex(int inValue) { _slotIndex = inValue; }
    #ifndef __EMSCRIPTEN__
	protected:
	#endif
		int _slotIndex;

		static const int ENTRIES = 4;
		static const int R = 1;
		static const int G = 2;
		static const int B = 3;
	};

	class SP_API AlphaTimeline : public CurveTimeline1 {
		friend class SkeletonBinary;

		friend class SkeletonJson;

	RTTI_DECL

	public:
		explicit AlphaTimeline(size_t frameCount, size_t bezierCount, int slotIndex);

		virtual ~AlphaTimeline();

		virtual void
		apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
			  MixDirection direction);

		int getSlotIndex() { return _slotIndex; };

		void setSlotIndex(int inValue) { _slotIndex = inValue; }
    #ifndef __EMSCRIPTEN__
	protected:
	#endif
		int _slotIndex;
	};

	class SP_API RGBA2Timeline : public CurveTimeline {
		friend class SkeletonBinary;

		friend class SkeletonJson;

	RTTI_DECL

	public:
		explicit RGBA2Timeline(size_t frameCount, size_t bezierCount, int slotIndex);

		virtual ~RGBA2Timeline();

		virtual void
		apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
			  MixDirection direction);

		/// Sets the time and value of the specified keyframe.
		void setFrame(int frame, float time, float r, float g, float b, float a, float r2, float g2, float b2);

		int getSlotIndex() { return _slotIndex; };

		void setSlotIndex(int inValue) { _slotIndex = inValue; }
    #ifndef __EMSCRIPTEN__
	protected:
	#endif
		
		int _slotIndex;

		static const int ENTRIES = 8;
		static const int R = 1;
		static const int G = 2;
		static const int B = 3;
		static const int A = 4;
		static const int R2 = 5;
		static const int G2 = 6;
		static const int B2 = 7;
	};

	class SP_API RGB2Timeline : public CurveTimeline {
		friend class SkeletonBinary;

		friend class SkeletonJson;

	RTTI_DECL

	public:
		explicit RGB2Timeline(size_t frameCount, size_t bezierCount, int slotIndex);

		virtual ~RGB2Timeline();

		virtual void
		apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha, MixBlend blend,
			  MixDirection direction);

		/// Sets the time and value of the specified keyframe.
		void setFrame(int frame, float time, float r, float g, float b, float r2, float g2, float b2);

		int getSlotIndex() { return _slotIndex; };

		void setSlotIndex(int inValue) { _slotIndex = inValue; }
    #ifndef __EMSCRIPTEN__
	protected:
	#endif
		
		int _slotIndex;

		static const int ENTRIES = 7;
		static const int R = 1;
		static const int G = 2;
		static const int B = 3;
		static const int R2 = 4;
		static const int G2 = 5;
		static const int B2 = 6;
	};
}

#endif /* Spine_ColorTimeline_h */
