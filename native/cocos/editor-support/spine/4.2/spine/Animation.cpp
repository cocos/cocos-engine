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

#include <spine/Animation.h>
#include <spine/Event.h>
#include <spine/Skeleton.h>
#include <spine/Timeline.h>

#include <spine/ContainerUtil.h>

#include <stdint.h>

using namespace spine;

Animation::Animation(const String &name, Vector<Timeline *> &timelines, float duration) : _timelines(timelines),
																						  _timelineIds(),
																						  _duration(duration),
																						  _name(name) {
	assert(_name.length() > 0);
	for (size_t i = 0; i < timelines.size(); i++) {
		Vector<PropertyId> propertyIds = timelines[i]->getPropertyIds();
		for (size_t ii = 0; ii < propertyIds.size(); ii++)
			_timelineIds.put(propertyIds[ii], true);
	}
}

bool Animation::hasTimeline(Vector<PropertyId> &ids) {
	for (size_t i = 0; i < ids.size(); i++) {
		if (_timelineIds.containsKey(ids[i])) return true;
	}
	return false;
}

Animation::~Animation() {
	ContainerUtil::cleanUpVectorOfPointers(_timelines);
}

void Animation::apply(Skeleton &skeleton, float lastTime, float time, bool loop, Vector<Event *> *pEvents, float alpha,
					  MixBlend blend, MixDirection direction) {
	if (loop && _duration != 0) {
		time = MathUtil::fmod(time, _duration);
		if (lastTime > 0) {
			lastTime = MathUtil::fmod(lastTime, _duration);
		}
	}

	for (size_t i = 0, n = _timelines.size(); i < n; ++i) {
		_timelines[i]->apply(skeleton, lastTime, time, pEvents, alpha, blend, direction);
	}
}

const String &Animation::getName() {
	return _name;
}

Vector<Timeline *> &Animation::getTimelines() {
	return _timelines;
}

float Animation::getDuration() {
	return _duration;
}

void Animation::setDuration(float inValue) {
	_duration = inValue;
}

int Animation::search(Vector<float> &frames, float target) {
	size_t n = (int) frames.size();
	for (size_t i = 1; i < n; i++) {
		if (frames[i] > target) return (int) (i - 1);
	}
	return (int) (n - 1);
}

int Animation::search(Vector<float> &frames, float target, int step) {
	size_t n = frames.size();
	for (size_t i = step; i < n; i += step)
		if (frames[i] > target) return (int) (i - step);
	return (int) (n - step);
}
