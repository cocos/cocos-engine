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

#include <spine/InheritTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Bone.h>
#include <spine/BoneData.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

using namespace spine;

RTTI_IMPL(InheritTimeline, Timeline)

InheritTimeline::InheritTimeline(size_t frameCount, int boneIndex) : Timeline(frameCount, ENTRIES),
																	 _boneIndex(boneIndex) {
	PropertyId ids[] = {((PropertyId) Property_Inherit << 32) | boneIndex};
	setPropertyIds(ids, 1);
}

InheritTimeline::~InheritTimeline() {
}

void InheritTimeline::setFrame(int frame, float time, Inherit inherit) {
	frame *= ENTRIES;
	_frames[frame] = time;
	_frames[frame + INHERIT] = inherit;
}


void InheritTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
							MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);
	SP_UNUSED(alpha);

	Bone *bone = skeleton.getBones()[_boneIndex];
	if (!bone->isActive()) return;

	if (direction == MixDirection_Out) {
		if (blend == MixBlend_Setup) bone->setInherit(bone->_data.getInherit());
		return;
	}

	if (time < _frames[0]) {
		if (blend == MixBlend_Setup || blend == MixBlend_First) bone->_inherit = bone->_data.getInherit();
		return;
	}
	int idx = Animation::search(_frames, time, ENTRIES) + INHERIT;
	bone->_inherit = static_cast<Inherit>(_frames[idx]);
}
