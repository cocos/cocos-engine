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

#ifndef Spine_SkeletonBinary_h
#define Spine_SkeletonBinary_h

#include <spine/Inherit.h>
#include <spine/Vector.h>
#include <spine/SpineObject.h>
#include <spine/SpineString.h>
#include <spine/Color.h>

namespace spine {
	class SkeletonData;

	class Atlas;

	class AttachmentLoader;

	class LinkedMesh;

	class Skin;

	class Attachment;

	class VertexAttachment;

	class Animation;

	class Timeline;

	class CurveTimeline;

	class CurveTimeline1;

	class CurveTimeline2;

	class Sequence;

	class SP_API SkeletonBinary : public SpineObject {
	public:
		static const int BONE_ROTATE = 0;
		static const int BONE_TRANSLATE = 1;
		static const int BONE_TRANSLATEX = 2;
		static const int BONE_TRANSLATEY = 3;
		static const int BONE_SCALE = 4;
		static const int BONE_SCALEX = 5;
		static const int BONE_SCALEY = 6;
		static const int BONE_SHEAR = 7;
		static const int BONE_SHEARX = 8;
		static const int BONE_SHEARY = 9;
        static const int BONE_INHERIT = 10;

		static const int SLOT_ATTACHMENT = 0;
		static const int SLOT_RGBA = 1;
		static const int SLOT_RGB = 2;
		static const int SLOT_RGBA2 = 3;
		static const int SLOT_RGB2 = 4;
		static const int SLOT_ALPHA = 5;

		static const int ATTACHMENT_DEFORM = 0;
		static const int ATTACHMENT_SEQUENCE = 1;

		static const int PATH_POSITION = 0;
		static const int PATH_SPACING = 1;
		static const int PATH_MIX = 2;

        static const int PHYSICS_INERTIA = 0;
        static const int PHYSICS_STRENGTH = 1;
        static const int PHYSICS_DAMPING = 2;
        static const int PHYSICS_MASS = 4;
        static const int PHYSICS_WIND = 5;
        static const int PHYSICS_GRAVITY = 6;
        static const int PHYSICS_MIX = 7;
        static const int PHYSICS_RESET = 8;

		static const int CURVE_LINEAR = 0;
		static const int CURVE_STEPPED = 1;
		static const int CURVE_BEZIER = 2;

		explicit SkeletonBinary(Atlas *atlasArray);

		explicit SkeletonBinary(AttachmentLoader *attachmentLoader, bool ownsLoader = false);

		~SkeletonBinary();

		SkeletonData *readSkeletonData(const unsigned char *binary, int length);

		SkeletonData *readSkeletonDataFile(const String &path);

		void setScale(float scale) { _scale = scale; }

		String &getError() { return _error; }

	private:
		struct DataInput : public SpineObject {
			const unsigned char *cursor;
			const unsigned char *end;
		};

		AttachmentLoader *_attachmentLoader;
		Vector<LinkedMesh *> _linkedMeshes;
		String _error;
		float _scale;
		const bool _ownsLoader;

		void setError(const char *value1, const char *value2);

		char *readString(DataInput *input);

		char *readStringRef(DataInput *input, SkeletonData *skeletonData);

		float readFloat(DataInput *input);

		unsigned char readByte(DataInput *input);

		signed char readSByte(DataInput *input);

		bool readBoolean(DataInput *input);

		int readInt(DataInput *input);

		void readColor(DataInput *input, Color &color);

		int readVarint(DataInput *input, bool optimizePositive);

		Skin *readSkin(DataInput *input, bool defaultSkin, SkeletonData *skeletonData, bool nonessential);

		Sequence *readSequence(DataInput *input);

		Attachment *readAttachment(DataInput *input, Skin *skin, int slotIndex, const String &attachmentName,
								   SkeletonData *skeletonData, bool nonessential);

		int readVertices(DataInput *input, Vector<float> &vertices, Vector<int> &bones, bool weighted);

		void readFloatArray(DataInput *input, int n, float scale, Vector<float> &array);

		void readShortArray(DataInput *input, Vector<unsigned short> &array, int n);

		Animation *readAnimation(const String &name, DataInput *input, SkeletonData *skeletonData);

		void
		setBezier(DataInput *input, CurveTimeline *timeline, int bezier, int frame, int value, float time1, float time2,
				  float value1, float value2, float scale);

		void readTimeline(DataInput *input, Vector<Timeline*> &timelines, CurveTimeline1 *timeline, float scale);

		void readTimeline2(DataInput *input, Vector<Timeline*> &timelines, CurveTimeline2 *timeline, float scale);
	};
}

#endif /* Spine_SkeletonBinary_h */
