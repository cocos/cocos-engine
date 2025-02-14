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

#include <spine/EventTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Animation.h>
#include <spine/ContainerUtil.h>
#include <spine/EventData.h>
#include <spine/Property.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

#include <float.h>

using namespace spine;

RTTI_IMPL(EventTimeline, Timeline)

EventTimeline::EventTimeline(size_t frameCount) : Timeline(frameCount, 1) {
	PropertyId ids[] = {((PropertyId) Property_Event << 32)};
	setPropertyIds(ids, 1);
	_events.setSize(frameCount, NULL);
}

EventTimeline::~EventTimeline() {
	ContainerUtil::cleanUpVectorOfPointers(_events);
}

void EventTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						  MixBlend blend, MixDirection direction) {
	if (pEvents == NULL) return;

	Vector<Event *> &events = *pEvents;

	size_t frameCount = _frames.size();

	if (lastTime > time) {
		// Fire events after last time for looped animations.
		apply(skeleton, lastTime, FLT_MAX, pEvents, alpha, blend, direction);
		lastTime = -1.0f;
	} else if (lastTime >= _frames[frameCount - 1]) {
		// Last time is after last i.
		return;
	}

	if (time < _frames[0]) return;// Time is before first i.

	int i;
	if (lastTime < _frames[0]) {
		i = 0;
	} else {
		i = Animation::search(_frames, lastTime) + 1;
		float frameTime = _frames[i];
		while (i > 0) {
			// Fire multiple events with the same i.
			if (_frames[i - 1] != frameTime) break;
			i--;
		}
	}

	for (; (size_t) i < frameCount && time >= _frames[i]; i++)
		events.add(_events[i]);
}

void EventTimeline::setFrame(size_t frame, Event *event) {
	_frames[frame] = event->getTime();
	_events[frame] = event;
}

Vector<Event *> &EventTimeline::getEvents() { return _events; }
