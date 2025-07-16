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

#include <spine/AttachmentTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Animation.h>
#include <spine/Bone.h>
#include <spine/Property.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

using namespace spine;

RTTI_IMPL(AttachmentTimeline, Timeline)

AttachmentTimeline::AttachmentTimeline(size_t frameCount, int slotIndex) : Timeline(frameCount, 1),
																		   _slotIndex(slotIndex) {
	PropertyId ids[] = {((PropertyId) Property_Attachment << 32) | slotIndex};
	setPropertyIds(ids, 1);

	_attachmentNames.ensureCapacity(frameCount);
	for (size_t i = 0; i < frameCount; ++i) {
		_attachmentNames.add(String());
	}
}

AttachmentTimeline::~AttachmentTimeline() {}

void AttachmentTimeline::setAttachment(Skeleton &skeleton, Slot &slot, String *attachmentName) {
	slot.setAttachment(attachmentName == NULL || attachmentName->isEmpty() ? NULL : skeleton.getAttachment(_slotIndex, *attachmentName));
}

void AttachmentTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
							   MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(alpha);

	Slot *slot = skeleton._slots[_slotIndex];
	if (!slot->_bone._active) return;

	if (direction == MixDirection_Out) {
		if (blend == MixBlend_Setup) setAttachment(skeleton, *slot, &slot->_data._attachmentName);
		return;
	}

	if (time < _frames[0]) {
		// Time is before first frame.
		if (blend == MixBlend_Setup || blend == MixBlend_First) {
			setAttachment(skeleton, *slot, &slot->_data._attachmentName);
		}
		return;
	}

	if (time < _frames[0]) {
		if (blend == MixBlend_Setup || blend == MixBlend_First)
			setAttachment(skeleton, *slot, &slot->_data._attachmentName);
		return;
	}

	setAttachment(skeleton, *slot, &_attachmentNames[Animation::search(_frames, time)]);
}

void AttachmentTimeline::setFrame(int frame, float time, const String &attachmentName) {
	_frames[frame] = time;
	_attachmentNames[frame] = attachmentName;
}

Vector<String> &AttachmentTimeline::getAttachmentNames() {
	return _attachmentNames;
}
