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

#ifndef Spine_Sequence_h
#define Spine_Sequence_h

#include <spine/Vector.h>
#include <spine/SpineString.h>
#include <spine/TextureRegion.h>

namespace spine {
	class Slot;

	class Attachment;

	class SkeletonBinary;
	class SkeletonJson;

	class SP_API Sequence : public SpineObject {
		friend class SkeletonBinary;
		friend class SkeletonJson;
	public:
		Sequence(int count);

		~Sequence();

		Sequence *copy();

		void apply(Slot *slot, Attachment *attachment);

		String getPath(const String &basePath, int index);

		int getId() { return _id; }

		void setId(int id) { _id = id; }

		int getStart() { return _start; }

		void setStart(int start) { _start = start; }

		int getDigits() { return _digits; }

		void setDigits(int digits) { _digits = digits; }

		int getSetupIndex() { return _setupIndex; }

		void setSetupIndex(int setupIndex) { _setupIndex = setupIndex; }

		Vector<TextureRegion *> &getRegions() { return _regions; }

	private:
		int _id;
		Vector<TextureRegion *> _regions;
		int _start;
		int _digits;
		int _setupIndex;

		int getNextID();
	};

	enum SequenceMode {
		hold = 0,
		once = 1,
		loop = 2,
		pingpong = 3,
		onceReverse = 4,
		loopReverse = 5,
		pingpongReverse = 6
	};
}

#endif
