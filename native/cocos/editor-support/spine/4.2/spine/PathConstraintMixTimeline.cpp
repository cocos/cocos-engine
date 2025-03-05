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

#include <spine/PathConstraintMixTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Animation.h>
#include <spine/PathConstraint.h>
#include <spine/PathConstraintData.h>
#include <spine/Property.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

using namespace spine;

RTTI_IMPL(PathConstraintMixTimeline, CurveTimeline)

PathConstraintMixTimeline::PathConstraintMixTimeline(size_t frameCount, size_t bezierCount, int pathConstraintIndex)
	: CurveTimeline(frameCount, PathConstraintMixTimeline::ENTRIES, bezierCount),
	  _constraintIndex(pathConstraintIndex) {
	PropertyId ids[] = {((PropertyId) Property_PathConstraintMix << 32) | pathConstraintIndex};
	setPropertyIds(ids, 1);
}

void PathConstraintMixTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
									  MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	PathConstraint *constraintP = skeleton._pathConstraints[_constraintIndex];
	PathConstraint &constraint = *constraintP;
	if (!constraint.isActive()) return;

	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				constraint._mixRotate = constraint._data._mixRotate;
				constraint._mixX = constraint._data._mixX;
				constraint._mixY = constraint._data._mixY;
				return;
			case MixBlend_First:
				constraint._mixRotate += (constraint._data._mixRotate - constraint._mixRotate) * alpha;
				constraint._mixX += (constraint._data._mixX - constraint._mixX) * alpha;
				constraint._mixY += (constraint._data._mixY - constraint._mixY) * alpha;
			default: {
			}
		}
		return;
	}

	float rotate, x, y;
	int i = Animation::search(_frames, time, PathConstraintMixTimeline::ENTRIES);
	int curveType = (int) _curves[i >> 2];
	switch (curveType) {
		case LINEAR: {
			float before = _frames[i];
			rotate = _frames[i + ROTATE];
			x = _frames[i + X];
			y = _frames[i + Y];
			float t = (time - before) / (_frames[i + ENTRIES] - before);
			rotate += (_frames[i + ENTRIES + ROTATE] - rotate) * t;
			x += (_frames[i + ENTRIES + X] - x) * t;
			y += (_frames[i + ENTRIES + Y] - y) * t;
			break;
		}
		case STEPPED: {
			rotate = _frames[i + ROTATE];
			x = _frames[i + X];
			y = _frames[i + Y];
			break;
		}
		default: {
			rotate = getBezierValue(time, i, ROTATE, curveType - BEZIER);
			x = getBezierValue(time, i, X, curveType + BEZIER_SIZE - BEZIER);
			y = getBezierValue(time, i, Y, curveType + BEZIER_SIZE * 2 - BEZIER);
		}
	}

	if (blend == MixBlend_Setup) {
		PathConstraintData data = constraint._data;
		constraint._mixRotate = data._mixRotate + (rotate - data._mixRotate) * alpha;
		constraint._mixX = data._mixX + (x - data._mixX) * alpha;
		constraint._mixY = data._mixY + (y - data._mixY) * alpha;
	} else {
		constraint._mixRotate += (rotate - constraint._mixRotate) * alpha;
		constraint._mixX += (x - constraint._mixX) * alpha;
		constraint._mixY += (y - constraint._mixY) * alpha;
	}
}

void PathConstraintMixTimeline::setFrame(int frame, float time, float mixRotate, float mixX, float mixY) {
	frame *= ENTRIES;
	_frames[frame] = time;
	_frames[frame + ROTATE] = mixRotate;
	_frames[frame + X] = mixX;
	_frames[frame + Y] = mixY;
}
