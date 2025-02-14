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

#include <spine/DrawOrderTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Animation.h>
#include <spine/Property.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

using namespace spine;

RTTI_IMPL(DrawOrderTimeline, Timeline)

DrawOrderTimeline::DrawOrderTimeline(size_t frameCount) : Timeline(frameCount, 1) {
	PropertyId ids[] = {((PropertyId) Property_DrawOrder << 32)};
	setPropertyIds(ids, 1);

	_drawOrders.ensureCapacity(frameCount);
	for (size_t i = 0; i < frameCount; ++i) {
		Vector<int> vec;
		_drawOrders.add(vec);
	}
}

void DrawOrderTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
							  MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(alpha);

	Vector<Slot *> &drawOrder = skeleton._drawOrder;
	Vector<Slot *> &slots = skeleton._slots;
	if (direction == MixDirection_Out) {
		if (blend == MixBlend_Setup) {
			drawOrder.clear();
			drawOrder.ensureCapacity(slots.size());
			for (size_t i = 0, n = slots.size(); i < n; ++i)
				drawOrder.add(slots[i]);
		}
		return;
	}

	if (time < _frames[0]) {
		if (blend == MixBlend_Setup || blend == MixBlend_First) {
			drawOrder.clear();
			drawOrder.ensureCapacity(slots.size());
			for (size_t i = 0, n = slots.size(); i < n; ++i)
				drawOrder.add(slots[i]);
		}
		return;
	}

	Vector<int> &drawOrderToSetupIndex = _drawOrders[Animation::search(_frames, time)];
	if (drawOrderToSetupIndex.size() == 0) {
		drawOrder.clear();
		for (size_t i = 0, n = slots.size(); i < n; ++i)
			drawOrder.add(slots[i]);
	} else {
		for (size_t i = 0, n = drawOrderToSetupIndex.size(); i < n; ++i)
			drawOrder[i] = slots[drawOrderToSetupIndex[i]];
	}
}

void DrawOrderTimeline::setFrame(size_t frame, float time, Vector<int> &drawOrder) {
	_frames[frame] = time;
	_drawOrders[frame].clear();
	_drawOrders[frame].addAll(drawOrder);
}

Vector<Vector<int>> &DrawOrderTimeline::getDrawOrders() {
	return _drawOrders;
}
