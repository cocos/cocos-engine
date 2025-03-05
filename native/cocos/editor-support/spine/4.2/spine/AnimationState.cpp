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

#include <spine/AnimationState.h>
#include <spine/Animation.h>
#include <spine/AnimationStateData.h>
#include <spine/AttachmentTimeline.h>
#include <spine/Bone.h>
#include <spine/BoneData.h>
#include <spine/DrawOrderTimeline.h>
#include <spine/Event.h>
#include <spine/EventTimeline.h>
#include <spine/RotateTimeline.h>
#include <spine/Skeleton.h>
#include <spine/SkeletonData.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

#include <float.h>

using namespace spine;

void dummyOnAnimationEventFunc(AnimationState *state, spine::EventType type, TrackEntry *entry, Event *event = NULL) {
	SP_UNUSED(state);
	SP_UNUSED(type);
	SP_UNUSED(entry);
	SP_UNUSED(event);
}

TrackEntry::TrackEntry() : _animation(NULL), _previous(NULL), _next(NULL), _mixingFrom(NULL), _mixingTo(0),
						   _trackIndex(0), _loop(false), _holdPrevious(false), _reverse(false),
						   _shortestRotation(false),
						   _eventThreshold(0), _mixAttachmentThreshold(0), _alphaAttachmentThreshold(0), _mixDrawOrderThreshold(0), _animationStart(0),
						   _animationEnd(0), _animationLast(0), _nextAnimationLast(0), _delay(0), _trackTime(0),
						   _trackLast(0), _nextTrackLast(0), _trackEnd(0), _timeScale(1.0f), _alpha(0), _mixTime(0),
						   _mixDuration(0), _interruptAlpha(0), _totalAlpha(0), _mixBlend(MixBlend_Replace),
						   _listener(dummyOnAnimationEventFunc), _listenerObject(NULL) {
}

TrackEntry::~TrackEntry() {}

int TrackEntry::getTrackIndex() { return _trackIndex; }

Animation *TrackEntry::getAnimation() { return _animation; }

TrackEntry *TrackEntry::getPrevious() { return _previous; }

bool TrackEntry::getLoop() { return _loop; }

void TrackEntry::setLoop(bool inValue) { _loop = inValue; }

bool TrackEntry::getHoldPrevious() { return _holdPrevious; }

void TrackEntry::setHoldPrevious(bool inValue) { _holdPrevious = inValue; }

bool TrackEntry::getReverse() { return _reverse; }

void TrackEntry::setReverse(bool inValue) { _reverse = inValue; }

bool TrackEntry::getShortestRotation() { return _shortestRotation; }

void TrackEntry::setShortestRotation(bool inValue) { _shortestRotation = inValue; }

float TrackEntry::getDelay() { return _delay; }

void TrackEntry::setDelay(float inValue) { _delay = inValue; }

float TrackEntry::getTrackTime() { return _trackTime; }

void TrackEntry::setTrackTime(float inValue) { _trackTime = inValue; }

float TrackEntry::getTrackEnd() { return _trackEnd; }

void TrackEntry::setTrackEnd(float inValue) { _trackEnd = inValue; }

float TrackEntry::getAnimationStart() { return _animationStart; }

void TrackEntry::setAnimationStart(float inValue) { _animationStart = inValue; }

float TrackEntry::getAnimationEnd() { return _animationEnd; }

void TrackEntry::setAnimationEnd(float inValue) { _animationEnd = inValue; }

float TrackEntry::getAnimationLast() { return _animationLast; }

void TrackEntry::setAnimationLast(float inValue) {
	_animationLast = inValue;
	_nextAnimationLast = inValue;
}

float TrackEntry::getAnimationTime() {
	if (_loop) {
		float duration = _animationEnd - _animationStart;
		if (duration == 0) return _animationStart;
		return MathUtil::fmod(_trackTime, duration) + _animationStart;
	}

	return MathUtil::min(_trackTime + _animationStart, _animationEnd);
}

float TrackEntry::getTimeScale() { return _timeScale; }

void TrackEntry::setTimeScale(float inValue) { _timeScale = inValue; }

float TrackEntry::getAlpha() { return _alpha; }

void TrackEntry::setAlpha(float inValue) { _alpha = inValue; }

float TrackEntry::getEventThreshold() { return _eventThreshold; }

void TrackEntry::setEventThreshold(float inValue) { _eventThreshold = inValue; }

float TrackEntry::getMixAttachmentThreshold() { return _mixAttachmentThreshold; }

void TrackEntry::setMixAttachmentThreshold(float inValue) { _mixAttachmentThreshold = inValue; }

float TrackEntry::getAlphaAttachmentThreshold() { return _alphaAttachmentThreshold; }

void TrackEntry::setAlphaAttachmentThreshold(float inValue) { _alphaAttachmentThreshold = inValue; }

float TrackEntry::getMixDrawOrderThreshold() { return _mixDrawOrderThreshold; }

void TrackEntry::setMixDrawOrderThreshold(float inValue) { _mixDrawOrderThreshold = inValue; }

TrackEntry *TrackEntry::getNext() { return _next; }

bool TrackEntry::isComplete() {
	return _trackTime >= _animationEnd - _animationStart;
}

float TrackEntry::getMixTime() { return _mixTime; }

void TrackEntry::setMixTime(float inValue) { _mixTime = inValue; }

float TrackEntry::getMixDuration() { return _mixDuration; }

void TrackEntry::setMixDuration(float inValue) { _mixDuration = inValue; }

void TrackEntry::setMixDuration(float mixDuration, float delay) {
	_mixDuration = mixDuration;
	if (_previous && delay <= 0) delay += _previous->getTrackComplete() - mixDuration;
	this->_delay = delay;
}

TrackEntry *TrackEntry::getMixingFrom() { return _mixingFrom; }

TrackEntry *TrackEntry::getMixingTo() { return _mixingTo; }

void TrackEntry::setMixBlend(MixBlend blend) { _mixBlend = blend; }

MixBlend TrackEntry::getMixBlend() { return _mixBlend; }

void TrackEntry::resetRotationDirections() {
	_timelinesRotation.clear();
}

void TrackEntry::setListener(AnimationStateListener inValue) {
	_listener = inValue;
	_listenerObject = NULL;
}

void TrackEntry::setListener(AnimationStateListenerObject *inValue) {
	_listener = dummyOnAnimationEventFunc;
	_listenerObject = inValue;
}

void TrackEntry::reset() {
	_animation = NULL;
	_previous = NULL;
	_next = NULL;
	_mixingFrom = NULL;
	_mixingTo = NULL;

	setRendererObject(NULL);

	_timelineMode.clear();
	_timelineHoldMix.clear();
	_timelinesRotation.clear();

	_listener = dummyOnAnimationEventFunc;
	_listenerObject = NULL;
}

float TrackEntry::getTrackComplete() {
	float duration = _animationEnd - _animationStart;
	if (duration != 0) {
		if (_loop) return duration * (1 + (int) (_trackTime / duration));// Completion of next loop.
		if (_trackTime < duration) return duration;                      // Before duration.
	}
	return _trackTime;// Next update.
}

bool TrackEntry::wasApplied() {
	return _nextTrackLast != -1;
}

EventQueueEntry::EventQueueEntry(EventType eventType, TrackEntry *trackEntry, Event *event) : _type(eventType),
																							  _entry(trackEntry),
																							  _event(event) {
}

EventQueue *EventQueue::newEventQueue(AnimationState &state) {
	return new (__FILE__, __LINE__) EventQueue(state);
}

EventQueueEntry EventQueue::newEventQueueEntry(EventType eventType, TrackEntry *entry, Event *event) {
	return EventQueueEntry(eventType, entry, event);
}

EventQueue::EventQueue(AnimationState &state) : _state(state),
												_drainDisabled(false) {
}

EventQueue::~EventQueue() {
}

void EventQueue::start(TrackEntry *entry) {
	_eventQueueEntries.add(newEventQueueEntry(EventType_Start, entry));
	_state._animationsChanged = true;
}

void EventQueue::interrupt(TrackEntry *entry) {
	_eventQueueEntries.add(newEventQueueEntry(EventType_Interrupt, entry));
}

void EventQueue::end(TrackEntry *entry) {
	_eventQueueEntries.add(newEventQueueEntry(EventType_End, entry));
	_state._animationsChanged = true;
}

void EventQueue::dispose(TrackEntry *entry) {
	_eventQueueEntries.add(newEventQueueEntry(EventType_Dispose, entry));
}

void EventQueue::complete(TrackEntry *entry) {
	_eventQueueEntries.add(newEventQueueEntry(EventType_Complete, entry));
}

void EventQueue::event(TrackEntry *entry, Event *event) {
	_eventQueueEntries.add(newEventQueueEntry(EventType_Event, entry, event));
}

/// Raises all events in the queue and drains the queue.
void EventQueue::drain() {
	if (_drainDisabled) {
		return;
	}

	_drainDisabled = true;

	AnimationState &state = _state;

	// Don't cache _eventQueueEntries.size() so callbacks can queue their own events (eg, call setAnimation in AnimationState_Complete).
	for (size_t i = 0; i < _eventQueueEntries.size(); ++i) {
		EventQueueEntry queueEntry = _eventQueueEntries[i];
		TrackEntry *trackEntry = queueEntry._entry;

		switch (queueEntry._type) {
			case EventType_Start:
			case EventType_Interrupt:
			case EventType_Complete:
				if (!trackEntry->_listenerObject) trackEntry->_listener(&state, queueEntry._type, trackEntry, NULL);
				else
					trackEntry->_listenerObject->callback(&state, queueEntry._type, trackEntry, NULL);
				if (!state._listenerObject) state._listener(&state, queueEntry._type, trackEntry, NULL);
				else
					state._listenerObject->callback(&state, queueEntry._type, trackEntry, NULL);
				break;
			case EventType_End:
				if (!trackEntry->_listenerObject) trackEntry->_listener(&state, queueEntry._type, trackEntry, NULL);
				else
					trackEntry->_listenerObject->callback(&state, queueEntry._type, trackEntry, NULL);
				if (!state._listenerObject) state._listener(&state, queueEntry._type, trackEntry, NULL);
				else
					state._listenerObject->callback(&state, queueEntry._type, trackEntry, NULL);
				/* Fall through. */
			case EventType_Dispose:
				if (!trackEntry->_listenerObject) trackEntry->_listener(&state, EventType_Dispose, trackEntry, NULL);
				else
					trackEntry->_listenerObject->callback(&state, EventType_Dispose, trackEntry, NULL);
				if (!state._listenerObject) state._listener(&state, EventType_Dispose, trackEntry, NULL);
				else
					state._listenerObject->callback(&state, EventType_Dispose, trackEntry, NULL);

				if (!_state.getManualTrackEntryDisposal()) _state.disposeTrackEntry(trackEntry);
				break;
			case EventType_Event:
				if (!trackEntry->_listenerObject)
					trackEntry->_listener(&state, queueEntry._type, trackEntry, queueEntry._event);
				else
					trackEntry->_listenerObject->callback(&state, queueEntry._type, trackEntry, queueEntry._event);
				if (!state._listenerObject) state._listener(&state, queueEntry._type, trackEntry, queueEntry._event);
				else
					state._listenerObject->callback(&state, queueEntry._type, trackEntry, queueEntry._event);
				break;
		}
	}
	_eventQueueEntries.clear();

	_drainDisabled = false;
}

AnimationState::AnimationState(AnimationStateData *data) : _data(data),
														   _queue(EventQueue::newEventQueue(*this)),
														   _animationsChanged(false),
														   _listener(dummyOnAnimationEventFunc),
														   _listenerObject(NULL),
														   _unkeyedState(0),
														   _timeScale(1),
														   _manualTrackEntryDisposal(false) {
}

AnimationState::~AnimationState() {
	for (size_t i = 0; i < _tracks.size(); i++) {
		TrackEntry *entry = _tracks[i];
		if (entry) {
			TrackEntry *from = entry->_mixingFrom;
			while (from) {
				TrackEntry *curr = from;
				from = curr->_mixingFrom;
				delete curr;
			}
			TrackEntry *next = entry->_next;
			while (next) {
				TrackEntry *curr = next;
				next = curr->_next;
				delete curr;
			}
			delete entry;
		}
	}
	delete _queue;
}

void AnimationState::update(float delta) {
	delta *= _timeScale;
	for (size_t i = 0, n = _tracks.size(); i < n; ++i) {
		TrackEntry *currentP = _tracks[i];
		if (currentP == NULL) {
			continue;
		}

		TrackEntry &current = *currentP;

		current._animationLast = current._nextAnimationLast;
		current._trackLast = current._nextTrackLast;

		float currentDelta = delta * current._timeScale;

		if (current._delay > 0) {
			current._delay -= currentDelta;
			if (current._delay > 0) {
				continue;
			}
			currentDelta = -current._delay;
			current._delay = 0;
		}

		TrackEntry *next = current._next;
		if (next != NULL) {
			// When the next entry's delay is passed, change to the next entry, preserving leftover time.
			float nextTime = current._trackLast - next->_delay;
			if (nextTime >= 0) {
				next->_delay = 0;
				next->_trackTime +=
						current._timeScale == 0 ? 0 : (nextTime / current._timeScale + delta) * next->_timeScale;
				current._trackTime += currentDelta;
				setCurrent(i, next, true);
				while (next->_mixingFrom != NULL) {
					next->_mixTime += delta;
					next = next->_mixingFrom;
				}
				continue;
			}
		} else if (current._trackLast >= current._trackEnd && current._mixingFrom == NULL) {
			// clear the track when there is no next entry, the track end time is reached, and there is no mixingFrom.
			_tracks[i] = NULL;

			_queue->end(currentP);
			clearNext(currentP);
			continue;
		}

		if (current._mixingFrom != NULL && updateMixingFrom(currentP, delta)) {
			// End mixing from entries once all have completed.
			TrackEntry *from = current._mixingFrom;
			current._mixingFrom = NULL;
			if (from != NULL) from->_mixingTo = NULL;
			while (from != NULL) {
				_queue->end(from);
				from = from->_mixingFrom;
			}
		}

		current._trackTime += currentDelta;
	}

	_queue->drain();
}

bool AnimationState::apply(Skeleton &skeleton) {
	if (_animationsChanged) {
		animationsChanged();
	}

	bool applied = false;
	for (size_t i = 0, n = _tracks.size(); i < n; ++i) {
		TrackEntry *currentP = _tracks[i];
		if (currentP == NULL || currentP->_delay > 0) {
			continue;
		}

		TrackEntry &current = *currentP;

		applied = true;
		MixBlend blend = i == 0 ? MixBlend_First : current._mixBlend;

		// apply mixing from entries first.
		float alpha = current._alpha;
		if (current._mixingFrom != NULL) {
			alpha *= applyMixingFrom(currentP, skeleton, blend);
		} else if (current._trackTime >= current._trackEnd && current._next == NULL) {
			alpha = 0;// Set to setup pose the last time the entry will be applied.
		}
		bool attachments = alpha >= current._alphaAttachmentThreshold;


		// apply current entry.
		float animationLast = current._animationLast, animationTime = current.getAnimationTime();
		float applyTime = animationTime;
		Vector<Event *> *applyEvents = &_events;
		if (current._reverse) {
			applyTime = current._animation->getDuration() - applyTime;
			applyEvents = NULL;
		}
		size_t timelineCount = current._animation->_timelines.size();
		Vector<Timeline *> &timelines = current._animation->_timelines;
		if ((i == 0 && alpha == 1) || blend == MixBlend_Add) {
			if (i == 0) attachments = true;
			for (size_t ii = 0; ii < timelineCount; ++ii) {
				Timeline *timeline = timelines[ii];
				if (timeline->getRTTI().isExactly(AttachmentTimeline::rtti))
					applyAttachmentTimeline(static_cast<AttachmentTimeline *>(timeline), skeleton, applyTime, blend,
											attachments);
				else
					timeline->apply(skeleton, animationLast, applyTime, applyEvents, alpha, blend, MixDirection_In);
			}
		} else {
			Vector<int> &timelineMode = current._timelineMode;

			bool shortestRotation = current._shortestRotation;
			bool firstFrame = !shortestRotation && current._timelinesRotation.size() != timelines.size() << 1;
			if (firstFrame) current._timelinesRotation.setSize(timelines.size() << 1, 0);
			Vector<float> &timelinesRotation = current._timelinesRotation;

			for (size_t ii = 0; ii < timelineCount; ++ii) {
				Timeline *timeline = timelines[ii];
				assert(timeline);

				MixBlend timelineBlend = timelineMode[ii] == Subsequent ? blend : MixBlend_Setup;

				if (!shortestRotation && timeline->getRTTI().isExactly(RotateTimeline::rtti))
					applyRotateTimeline(static_cast<RotateTimeline *>(timeline), skeleton, applyTime, alpha,
										timelineBlend, timelinesRotation, ii << 1, firstFrame);
				else if (timeline->getRTTI().isExactly(AttachmentTimeline::rtti))
					applyAttachmentTimeline(static_cast<AttachmentTimeline *>(timeline), skeleton, applyTime,
											blend, attachments);
				else
					timeline->apply(skeleton, animationLast, applyTime, applyEvents, alpha, timelineBlend,
									MixDirection_In);
			}
		}

		queueEvents(currentP, animationTime);
		_events.clear();
		current._nextAnimationLast = animationTime;
		current._nextTrackLast = current._trackTime;
	}

	int setupState = _unkeyedState + Setup;
	Vector<Slot *> &slots = skeleton.getSlots();
	for (int i = 0, n = (int) slots.size(); i < n; i++) {
		Slot *slot = slots[i];
		if (slot->getAttachmentState() == setupState) {
			const String &attachmentName = slot->getData().getAttachmentName();
			slot->setAttachment(attachmentName.isEmpty() ? NULL : skeleton.getAttachment(slot->getData().getIndex(), attachmentName));
		}
	}
	_unkeyedState += 2;

	_queue->drain();
	return applied;
}

void AnimationState::clearTracks() {
	bool oldDrainDisabled = _queue->_drainDisabled;
	_queue->_drainDisabled = true;
	for (size_t i = 0, n = _tracks.size(); i < n; ++i)
		clearTrack(i);
	_tracks.clear();
	_queue->_drainDisabled = oldDrainDisabled;
	_queue->drain();
}

void AnimationState::clearTrack(size_t trackIndex) {
	if (trackIndex >= _tracks.size()) return;

	TrackEntry *current = _tracks[trackIndex];
	if (current == NULL) return;

	_queue->end(current);

	clearNext(current);

	TrackEntry *entry = current;
	while (true) {
		TrackEntry *from = entry->_mixingFrom;
		if (from == NULL) break;

		_queue->end(from);
		entry->_mixingFrom = NULL;
		entry->_mixingTo = NULL;
		entry = from;
	}

	_tracks[current->_trackIndex] = NULL;

	_queue->drain();
}

TrackEntry *AnimationState::setAnimation(size_t trackIndex, const String &animationName, bool loop) {
	Animation *animation = _data->_skeletonData->findAnimation(animationName);
	assert(animation != NULL);
	return setAnimation(trackIndex, animation, loop);
}

TrackEntry *AnimationState::setAnimation(size_t trackIndex, Animation *animation, bool loop) {
	assert(animation != NULL);

	bool interrupt = true;
	TrackEntry *current = expandToIndex(trackIndex);
	if (current != NULL) {
		if (current->_nextTrackLast == -1) {
			// Don't mix from an entry that was never applied.
			_tracks[trackIndex] = current->_mixingFrom;
			_queue->interrupt(current);
			_queue->end(current);
			clearNext(current);
			current = current->_mixingFrom;
			interrupt = false;
		} else {
			clearNext(current);
		}
	}

	TrackEntry *entry = newTrackEntry(trackIndex, animation, loop, current);
	setCurrent(trackIndex, entry, interrupt);
	_queue->drain();

	return entry;
}

TrackEntry *AnimationState::addAnimation(size_t trackIndex, const String &animationName, bool loop, float delay) {
	Animation *animation = _data->_skeletonData->findAnimation(animationName);
	assert(animation != NULL);
	return addAnimation(trackIndex, animation, loop, delay);
}

TrackEntry *AnimationState::addAnimation(size_t trackIndex, Animation *animation, bool loop, float delay) {
	assert(animation != NULL);

	TrackEntry *last = expandToIndex(trackIndex);
	if (last != NULL) {
		while (last->_next != NULL)
			last = last->_next;
	}

	TrackEntry *entry = newTrackEntry(trackIndex, animation, loop, last);

	if (last == NULL) {
		setCurrent(trackIndex, entry, true);
		_queue->drain();
	} else {
		last->_next = entry;
		entry->_previous = last;
		if (delay <= 0) delay += last->getTrackComplete() - entry->_mixDuration;
	}

	entry->_delay = delay;
	return entry;
}

TrackEntry *AnimationState::setEmptyAnimation(size_t trackIndex, float mixDuration) {
	TrackEntry *entry = setAnimation(trackIndex, AnimationState::getEmptyAnimation(), false);
	entry->_mixDuration = mixDuration;
	entry->_trackEnd = mixDuration;
	return entry;
}

TrackEntry *AnimationState::addEmptyAnimation(size_t trackIndex, float mixDuration, float delay) {
	TrackEntry *entry = addAnimation(trackIndex, AnimationState::getEmptyAnimation(), false, delay);
	if (delay <= 0) entry->_delay += entry->_mixDuration - mixDuration;
	entry->_mixDuration = mixDuration;
	entry->_trackEnd = mixDuration;
	return entry;
}

void AnimationState::setEmptyAnimations(float mixDuration) {
	bool oldDrainDisabled = _queue->_drainDisabled;
	_queue->_drainDisabled = true;
	for (size_t i = 0, n = _tracks.size(); i < n; ++i) {
		TrackEntry *current = _tracks[i];
		if (current != NULL) {
			setEmptyAnimation(i, mixDuration);
		}
	}
	_queue->_drainDisabled = oldDrainDisabled;
	_queue->drain();
}

TrackEntry *AnimationState::getCurrent(size_t trackIndex) {
	return trackIndex >= _tracks.size() ? NULL : _tracks[trackIndex];
}

AnimationStateData *AnimationState::getData() {
	return _data;
}

Vector<TrackEntry *> &AnimationState::getTracks() {
	return _tracks;
}

float AnimationState::getTimeScale() {
	return _timeScale;
}

void AnimationState::setTimeScale(float inValue) {
	_timeScale = inValue;
}

void AnimationState::setListener(AnimationStateListener inValue) {
	_listener = inValue;
	_listenerObject = NULL;
}

void AnimationState::setListener(AnimationStateListenerObject *inValue) {
	_listener = dummyOnAnimationEventFunc;
	_listenerObject = inValue;
}

void AnimationState::disableQueue() {
	_queue->_drainDisabled = true;
}

void AnimationState::enableQueue() {
	_queue->_drainDisabled = false;
}

void AnimationState::setManualTrackEntryDisposal(bool inValue) {
	_manualTrackEntryDisposal = inValue;
}

bool AnimationState::getManualTrackEntryDisposal() {
	return _manualTrackEntryDisposal;
}

void AnimationState::disposeTrackEntry(TrackEntry *entry) {
	entry->reset();
	_trackEntryPool.free(entry);
}

Animation *AnimationState::getEmptyAnimation() {
	static Vector<Timeline *> timelines;
	static Animation ret(String("<empty>"), timelines, 0);
	return &ret;
}

void AnimationState::applyAttachmentTimeline(AttachmentTimeline *attachmentTimeline, Skeleton &skeleton, float time,
											 MixBlend blend, bool attachments) {
	Slot *slot = skeleton.getSlots()[attachmentTimeline->getSlotIndex()];
	if (!slot->getBone().isActive()) return;

	Vector<float> &frames = attachmentTimeline->getFrames();
	if (time < frames[0]) {
		if (blend == MixBlend_Setup || blend == MixBlend_First)
			setAttachment(skeleton, *slot, slot->getData().getAttachmentName(), attachments);
	} else {
		setAttachment(skeleton, *slot, attachmentTimeline->getAttachmentNames()[Animation::search(frames, time)],
					  attachments);
	}

	/* If an attachment wasn't set (ie before the first frame or attachments is false), set the setup attachment later.*/
	if (slot->getAttachmentState() <= _unkeyedState) slot->setAttachmentState(_unkeyedState + Setup);
}


void AnimationState::applyRotateTimeline(RotateTimeline *rotateTimeline, Skeleton &skeleton, float time, float alpha,
										 MixBlend blend, Vector<float> &timelinesRotation, size_t i, bool firstFrame) {
	if (firstFrame) timelinesRotation[i] = 0;

	if (alpha == 1) {
		rotateTimeline->apply(skeleton, 0, time, NULL, 1, blend, MixDirection_In);
		return;
	}

	Bone *bone = skeleton._bones[rotateTimeline->_boneIndex];
	if (!bone->isActive()) return;
	Vector<float> &frames = rotateTimeline->_frames;
	float r1, r2;
	if (time < frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				bone->_rotation = bone->_data._rotation;
			default:
				return;
			case MixBlend_First:
				r1 = bone->_rotation;
				r2 = bone->_data._rotation;
		}
	} else {
		r1 = blend == MixBlend_Setup ? bone->_data._rotation : bone->_rotation;
		r2 = bone->_data._rotation + rotateTimeline->getCurveValue(time);
	}

	// Mix between rotations using the direction of the shortest route on the first frame while detecting crosses.
	float total, diff = r2 - r1;
	diff -= MathUtil::ceil(diff / 360 - 0.5) * 360;
	if (diff == 0) {
		total = timelinesRotation[i];
	} else {
		float lastTotal, lastDiff;
		if (firstFrame) {
			lastTotal = 0;
			lastDiff = diff;
		} else {
			lastTotal = timelinesRotation[i];
			lastDiff = timelinesRotation[i + 1];
		}
		float loops = lastTotal - MathUtil::fmod(lastTotal, 360.f);
		total = diff + loops;
		bool current = diff >= 0, dir = lastTotal >= 0;
		if (MathUtil::abs(lastDiff) <= 90 && MathUtil::sign(lastDiff) != MathUtil::sign(diff)) {
			if (MathUtil::abs(lastTotal - loops) > 180) {
				total += 360.f * MathUtil::sign(lastTotal);
				dir = current;
			} else if (loops != 0)
				total -= 360.f * MathUtil::sign(lastTotal);
			else
				dir = current;
		}
		if (dir != current) {
			total += 360 * MathUtil::sign(lastTotal);
		}
		timelinesRotation[i] = total;
	}
	timelinesRotation[i + 1] = diff;
	bone->_rotation = r1 + total * alpha;
}

bool AnimationState::updateMixingFrom(TrackEntry *to, float delta) {
	TrackEntry *from = to->_mixingFrom;
	if (from == NULL) {
		return true;
	}

	bool finished = updateMixingFrom(from, delta);

	from->_animationLast = from->_nextAnimationLast;
	from->_trackLast = from->_nextTrackLast;

	if (to->_nextTrackLast != -1) {                             // The from entry was applied at least once.
		bool discard = to->_mixTime == 0 && from->_mixTime == 0;// Discard the from entry when neither have advanced yet.
		if (to->_mixTime >= to->_mixDuration || discard) {
			// Require totalAlpha == 0 to ensure mixing is complete or the transition is a single frame or discarded.
			if (from->_totalAlpha == 0 || to->_mixDuration == 0 || discard) {
				to->_mixingFrom = from->_mixingFrom;
				if (from->_mixingFrom) from->_mixingFrom->_mixingTo = to;
				to->_interruptAlpha = from->_interruptAlpha;
				_queue->end(from);
			}
			return finished;
		}
	}

	from->_trackTime += delta * from->_timeScale;
	to->_mixTime += delta;

	return false;
}

float AnimationState::applyMixingFrom(TrackEntry *to, Skeleton &skeleton, MixBlend blend) {
	TrackEntry *from = to->_mixingFrom;
	if (from->_mixingFrom != NULL) applyMixingFrom(from, skeleton, blend);

	float mix;
	if (to->_mixDuration == 0) {
		// Single frame mix to undo mixingFrom changes.
		mix = 1;
		if (blend == MixBlend_First) blend = MixBlend_Setup;
	} else {
		mix = to->_mixTime / to->_mixDuration;
		if (mix > 1) {
			mix = 1;
		}
		if (blend != MixBlend_First) blend = from->_mixBlend;
	}

	bool attachments = mix < from->_mixAttachmentThreshold, drawOrder = mix < from->_mixDrawOrderThreshold;
	Vector<Timeline *> &timelines = from->_animation->_timelines;
	size_t timelineCount = timelines.size();
	float alphaHold = from->_alpha * to->_interruptAlpha, alphaMix = alphaHold * (1 - mix);
	float animationLast = from->_animationLast, animationTime = from->getAnimationTime();
	float applyTime = animationTime;
	Vector<Event *> *events = NULL;
	if (from->_reverse) {
		applyTime = from->_animation->_duration - applyTime;
	} else {
		if (mix < from->_eventThreshold) events = &_events;
	}

	if (blend == MixBlend_Add) {
		for (size_t i = 0; i < timelineCount; i++)
			timelines[i]->apply(skeleton, animationLast, applyTime, events, alphaMix, blend, MixDirection_Out);
	} else {
		Vector<int> &timelineMode = from->_timelineMode;
		Vector<TrackEntry *> &timelineHoldMix = from->_timelineHoldMix;

		bool shortestRotation = from->_shortestRotation;
		bool firstFrame = !shortestRotation && from->_timelinesRotation.size() != timelines.size() << 1;
		if (firstFrame) from->_timelinesRotation.setSize(timelines.size() << 1, 0);

		Vector<float> &timelinesRotation = from->_timelinesRotation;

		from->_totalAlpha = 0;
		for (size_t i = 0; i < timelineCount; i++) {
			Timeline *timeline = timelines[i];
			MixDirection direction = MixDirection_Out;
			MixBlend timelineBlend;
			float alpha;
			switch (timelineMode[i]) {
				case Subsequent:
					if (!drawOrder && (timeline->getRTTI().isExactly(DrawOrderTimeline::rtti))) continue;
					timelineBlend = blend;
					alpha = alphaMix;
					break;
				case First:
					timelineBlend = MixBlend_Setup;
					alpha = alphaMix;
					break;
				case HoldSubsequent:
					timelineBlend = blend;
					alpha = alphaHold;
					break;
				case HoldFirst:
					timelineBlend = MixBlend_Setup;
					alpha = alphaHold;
					break;
				default:
					timelineBlend = MixBlend_Setup;
					TrackEntry *holdMix = timelineHoldMix[i];
					alpha = alphaHold * MathUtil::max(0.0f, 1.0f - holdMix->_mixTime / holdMix->_mixDuration);
					break;
			}
			from->_totalAlpha += alpha;
			if (!shortestRotation && (timeline->getRTTI().isExactly(RotateTimeline::rtti))) {
				applyRotateTimeline((RotateTimeline *) timeline, skeleton, applyTime, alpha, timelineBlend,
									timelinesRotation, i << 1, firstFrame);
			} else if (timeline->getRTTI().isExactly(AttachmentTimeline::rtti)) {
				applyAttachmentTimeline(static_cast<AttachmentTimeline *>(timeline), skeleton, applyTime, timelineBlend,
										attachments && alpha >= from->_alphaAttachmentThreshold);
			} else {
				if (drawOrder && timeline->getRTTI().isExactly(DrawOrderTimeline::rtti) &&
					timelineBlend == MixBlend_Setup)
					direction = MixDirection_In;
				timeline->apply(skeleton, animationLast, applyTime, events, alpha, timelineBlend, direction);
			}
		}
	}

	if (to->_mixDuration > 0) {
		queueEvents(from, animationTime);
	}

	_events.clear();
	from->_nextAnimationLast = animationTime;
	from->_nextTrackLast = from->_trackTime;

	return mix;
}

void AnimationState::setAttachment(Skeleton &skeleton, Slot &slot, const String &attachmentName, bool attachments) {
	slot.setAttachment(
			attachmentName.isEmpty() ? NULL : skeleton.getAttachment(slot.getData().getIndex(), attachmentName));
	if (attachments) slot.setAttachmentState(_unkeyedState + Current);
}

void AnimationState::queueEvents(TrackEntry *entry, float animationTime) {
	float animationStart = entry->_animationStart, animationEnd = entry->_animationEnd;
	float duration = animationEnd - animationStart;
	float trackLastWrapped = duration != 0 ? MathUtil::fmod(entry->_trackLast, duration) : MathUtil::quietNan();

	// Queue events before complete.
	size_t i = 0, n = _events.size();
	for (; i < n; ++i) {
		Event *e = _events[i];
		if (e->_time < trackLastWrapped) break;
		if (e->_time > animationEnd) continue;// Discard events outside animation start/end.
		_queue->event(entry, e);
	}

	// Queue complete if completed a loop iteration or the animation.
	bool complete = false;
	if (entry->_loop) {
		if (duration == 0)
			complete = true;
		else {
			int cycles = (int) (entry->_trackTime / duration);
			complete = cycles > 0 && cycles > (int) (entry->_trackLast / duration);
		}
	} else {
		complete = animationTime >= animationEnd && entry->_animationLast < animationEnd;
	}
	if (complete) _queue->complete(entry);

	// Queue events after complete.
	for (; i < n; ++i) {
		Event *e = _events[i];
		if (e->_time < animationStart) continue;// Discard events outside animation start/end.
		_queue->event(entry, e);
	}
}

void AnimationState::setCurrent(size_t index, TrackEntry *current, bool interrupt) {
	TrackEntry *from = expandToIndex(index);
	_tracks[index] = current;
	current->_previous = NULL;

	if (from != NULL) {
		if (interrupt) _queue->interrupt(from);

		current->_mixingFrom = from;
		from->_mixingTo = current;
		current->_mixTime = 0;

		// Store interrupted mix percentage.
		if (from->_mixingFrom != NULL && from->_mixDuration > 0) {
			current->_interruptAlpha *= MathUtil::min(1.0f, from->_mixTime / from->_mixDuration);
		}

		from->_timelinesRotation.clear();// Reset rotation for mixing out, in case entry was mixed in.
	}

	_queue->start(current);// triggers animationsChanged
}

TrackEntry *AnimationState::expandToIndex(size_t index) {
	if (index < _tracks.size()) return _tracks[index];
	while (index >= _tracks.size())
		_tracks.add(NULL);
	return NULL;
}

TrackEntry *AnimationState::newTrackEntry(size_t trackIndex, Animation *animation, bool loop, TrackEntry *last) {
	TrackEntry *entryP = _trackEntryPool.obtain();// Pooling
	TrackEntry &entry = *entryP;

	entry._trackIndex = (int) trackIndex;
	entry._animation = animation;
	entry._loop = loop;
	entry._holdPrevious = 0;

	entry._reverse = false;
	entry._shortestRotation = false;

	entry._eventThreshold = 0;
	entry._alphaAttachmentThreshold = 0;
	entry._mixAttachmentThreshold = 0;
	entry._mixDrawOrderThreshold = 0;

	entry._animationStart = 0;
	entry._animationEnd = animation->getDuration();
	entry._animationLast = -1;
	entry._nextAnimationLast = -1;

	entry._delay = 0;
	entry._trackTime = 0;
	entry._trackLast = -1;
	entry._nextTrackLast = -1;// nextTrackLast == -1 signifies a TrackEntry that wasn't applied yet.
	entry._trackEnd = FLT_MAX;// loop ? float.MaxValue : animation.Duration;
	entry._timeScale = 1;

	entry._alpha = 1;
	entry._mixTime = 0;
	entry._mixDuration = (last == NULL) ? 0 : _data->getMix(last->_animation, animation);
	entry._interruptAlpha = 1;
	entry._totalAlpha = 0;
	entry._mixBlend = MixBlend_Replace;

	return entryP;
}

void AnimationState::clearNext(TrackEntry *entry) {
	TrackEntry *next = entry->_next;
	while (next != NULL) {
		_queue->dispose(next);
		next = next->_next;
	}
	entry->_next = NULL;
}

void AnimationState::animationsChanged() {
	_animationsChanged = false;

	_propertyIDs.clear();

	for (size_t i = 0, n = _tracks.size(); i < n; ++i) {
		TrackEntry *entry = _tracks[i];
		if (!entry) continue;

		while (entry->_mixingFrom != NULL)
			entry = entry->_mixingFrom;

		do {
			if (entry->_mixingTo == NULL || entry->_mixBlend != MixBlend_Add) computeHold(entry);
			entry = entry->_mixingTo;
		} while (entry != NULL);
	}
}

void AnimationState::computeHold(TrackEntry *entry) {
	TrackEntry *to = entry->_mixingTo;
	Vector<Timeline *> &timelines = entry->_animation->_timelines;
	size_t timelinesCount = timelines.size();
	Vector<int> &timelineMode = entry->_timelineMode;
	timelineMode.setSize(timelinesCount, 0);
	Vector<TrackEntry *> &timelineHoldMix = entry->_timelineHoldMix;
	timelineHoldMix.setSize(timelinesCount, 0);

	if (to != NULL && to->_holdPrevious) {
		for (size_t i = 0; i < timelinesCount; i++) {
			timelineMode[i] = _propertyIDs.addAll(timelines[i]->getPropertyIds(), true) ? HoldFirst : HoldSubsequent;
		}
		return;
	}

	// outer:
	size_t i = 0;
continue_outer:
	for (; i < timelinesCount; ++i) {
		Timeline *timeline = timelines[i];
		Vector<PropertyId> &ids = timeline->getPropertyIds();
		if (!_propertyIDs.addAll(ids, true)) {
			timelineMode[i] = Subsequent;
		} else {
			if (to == NULL || timeline->getRTTI().isExactly(AttachmentTimeline::rtti) ||
				timeline->getRTTI().isExactly(DrawOrderTimeline::rtti) ||
				timeline->getRTTI().isExactly(EventTimeline::rtti) || !to->_animation->hasTimeline(ids)) {
				timelineMode[i] = First;
			} else {
				for (TrackEntry *next = to->_mixingTo; next != NULL; next = next->_mixingTo) {
					if (next->_animation->hasTimeline(ids)) continue;
					if (next->_mixDuration > 0) {
						timelineMode[i] = HoldMix;
						timelineHoldMix[i] = next;
						i++;
						goto continue_outer;// continue outer;
					}
					break;
				}
				timelineMode[i] = HoldFirst;
			}
		}
	}
}
