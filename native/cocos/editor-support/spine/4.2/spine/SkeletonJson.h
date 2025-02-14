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

#ifndef Spine_SkeletonJson_h
#define Spine_SkeletonJson_h

#include <spine/Vector.h>
#include <spine/SpineObject.h>
#include <spine/SpineString.h>

namespace spine {
	class Timeline;

	class CurveTimeline;

	class CurveTimeline1;

	class CurveTimeline2;

	class VertexAttachment;

	class Animation;

	class Json;

	class SkeletonData;

	class Atlas;

	class AttachmentLoader;

	class LinkedMesh;

	class String;

	class Sequence;

	class SP_API SkeletonJson : public SpineObject {
	public:
		explicit SkeletonJson(Atlas *atlas);

		explicit SkeletonJson(AttachmentLoader *attachmentLoader, bool ownsLoader = false);

		~SkeletonJson();

		SkeletonData *readSkeletonDataFile(const String &path);

		SkeletonData *readSkeletonData(const char *json);

		void setScale(float scale) { _scale = scale; }

		String &getError() { return _error; }

	private:
		AttachmentLoader *_attachmentLoader;
		Vector<LinkedMesh *> _linkedMeshes;
		float _scale;
		const bool _ownsLoader;
		String _error;

		static Sequence *readSequence(Json *sequence);

		static void
		setBezier(CurveTimeline *timeline, int frame, int value, int bezier, float time1, float value1, float cx1,
				  float cy1,
				  float cx2, float cy2, float time2, float value2);

		static int
		readCurve(Json *curve, CurveTimeline *timeline, int bezier, int frame, int value, float time1, float time2,
				  float value1, float value2, float scale);

		static Timeline *readTimeline(Json *keyMap, CurveTimeline1 *timeline, float defaultValue, float scale);

		static Timeline *
		readTimeline(Json *keyMap, CurveTimeline2 *timeline, const char *name1, const char *name2, float defaultValue,
					 float scale);

		Animation *readAnimation(Json *root, SkeletonData *skeletonData);

		void readVertices(Json *attachmentMap, VertexAttachment *attachment, size_t verticesLength);

		void setError(Json *root, const String &value1, const String &value2);

		int findSlotIndex(SkeletonData *skeletonData, const String &slotName, Vector<Timeline *> timelines);
	};
}

#endif /* Spine_SkeletonJson_h */
