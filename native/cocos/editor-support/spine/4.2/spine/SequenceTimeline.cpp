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

#include <spine/SequenceTimeline.h>
#include <spine/Bone.h>
#include <spine/RegionAttachment.h>
#include <spine/MeshAttachment.h>
#include <spine/Event.h>
#include <spine/Skeleton.h>
#include <spine/Attachment.h>
#include <spine/PathConstraintData.h>
#include <spine/Slot.h>
#include <spine/Animation.h>

using namespace spine;

RTTI_IMPL(SequenceTimeline, Timeline)

SequenceTimeline::SequenceTimeline(size_t frameCount, int slotIndex, Attachment *attachment) : Timeline(frameCount, ENTRIES), _slotIndex(slotIndex), _attachment(attachment) {
	int sequenceId = 0;
	if (attachment->getRTTI().instanceOf(RegionAttachment::rtti)) sequenceId = ((RegionAttachment *) attachment)->getSequence()->getId();
	if (attachment->getRTTI().instanceOf(MeshAttachment::rtti)) sequenceId = ((MeshAttachment *) attachment)->getSequence()->getId();
	PropertyId ids[] = {((PropertyId) Property_Sequence << 32) | ((slotIndex << 16 | sequenceId) & 0xffffffff)};
	setPropertyIds(ids, 1);
}

SequenceTimeline::~SequenceTimeline() {
}

void SequenceTimeline::setFrame(int frame, float time, SequenceMode mode, int index, float delay) {
	Vector<float> &frames = this->_frames;
	frame *= ENTRIES;
	frames[frame] = time;
	frames[frame + MODE] = mode | (index << 4);
	frames[frame + DELAY] = delay;
}

void SequenceTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents,
							 float alpha, MixBlend blend, MixDirection direction) {
	SP_UNUSED(alpha);
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Slot *slot = skeleton.getSlots()[_slotIndex];
	if (!slot->getBone().isActive()) return;
	Attachment *slotAttachment = slot->getAttachment();
	if (slotAttachment != _attachment) {
		if (slotAttachment == NULL || !slotAttachment->getRTTI().instanceOf(VertexAttachment::rtti) || ((VertexAttachment *) slotAttachment)->getTimelineAttachment() != _attachment) return;
	}
	Sequence *sequence = NULL;
	if (_attachment->getRTTI().instanceOf(RegionAttachment::rtti)) sequence = ((RegionAttachment *) _attachment)->getSequence();
	if (_attachment->getRTTI().instanceOf(MeshAttachment::rtti)) sequence = ((MeshAttachment *) _attachment)->getSequence();
	if (!sequence) return;

	if (direction == MixDirection_Out) {
		if (blend == MixBlend_Setup) slot->setSequenceIndex(-1);
		return;
	}

	Vector<float> &frames = this->_frames;
	if (time < frames[0]) {// Time is before first frame.
		if (blend == MixBlend_Setup || blend == MixBlend_First) slot->setSequenceIndex(-1);
		return;
	}

	int i = Animation::search(frames, time, ENTRIES);
	float before = frames[i];
	int modeAndIndex = (int) frames[i + MODE];
	float delay = frames[i + DELAY];

	int index = modeAndIndex >> 4, count = (int) sequence->getRegions().size();
	int mode = modeAndIndex & 0xf;
	if (mode != SequenceMode::hold) {
		index += (int) (((time - before) / delay + 0.0001));
		switch (mode) {
			case SequenceMode::once:
				index = MathUtil::min(count - 1, index);
				break;
			case SequenceMode::loop:
				index %= count;
				break;
			case SequenceMode::pingpong: {
				int n = (count << 1) - 2;
				index = n == 0 ? 0 : index % n;
				if (index >= count) index = n - index;
				break;
			}
			case SequenceMode::onceReverse:
				index = MathUtil::max(count - 1 - index, 0);
				break;
			case SequenceMode::loopReverse:
				index = count - 1 - (index % count);
				break;
			case SequenceMode::pingpongReverse: {
				int n = (count << 1) - 2;
				index = n == 0 ? 0 : (index + count - 1) % n;
				if (index >= count) index = n - index;
			}
		}
	}
	slot->setSequenceIndex(index);
}
