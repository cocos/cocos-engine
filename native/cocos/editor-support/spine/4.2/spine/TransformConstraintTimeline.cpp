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

#include <spine/TransformConstraintTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Animation.h>
#include <spine/Property.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>
#include <spine/TransformConstraint.h>
#include <spine/TransformConstraintData.h>

using namespace spine;

RTTI_IMPL(TransformConstraintTimeline, CurveTimeline)

TransformConstraintTimeline::TransformConstraintTimeline(size_t frameCount, size_t bezierCount,
														 int transformConstraintIndex) : CurveTimeline(frameCount,
																									   TransformConstraintTimeline::ENTRIES,
																									   bezierCount),
																						 _constraintIndex(
																								 transformConstraintIndex) {
	PropertyId ids[] = {((PropertyId) Property_TransformConstraint << 32) | transformConstraintIndex};
	setPropertyIds(ids, 1);
}

void TransformConstraintTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents,
										float alpha, MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	TransformConstraint *constraintP = skeleton._transformConstraints[_constraintIndex];
	TransformConstraint &constraint = *constraintP;
	if (!constraint.isActive()) return;

	TransformConstraintData &data = constraint._data;
	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				constraint._mixRotate = data._mixRotate;
				constraint._mixX = data._mixX;
				constraint._mixY = data._mixY;
				constraint._mixScaleX = data._mixScaleX;
				constraint._mixScaleY = data._mixScaleY;
				constraint._mixShearY = data._mixShearY;
				return;
			case MixBlend_First:
				constraint._mixRotate += (data._mixRotate - constraint._mixRotate) * alpha;
				constraint._mixX += (data._mixX - constraint._mixX) * alpha;
				constraint._mixY += (data._mixY - constraint._mixY) * alpha;
				constraint._mixScaleX += (data._mixScaleX - constraint._mixScaleX) * alpha;
				constraint._mixScaleY += (data._mixScaleY - constraint._mixScaleY) * alpha;
				constraint._mixShearY += (data._mixShearY - constraint._mixShearY) * alpha;
				return;
			default:
				return;
		}
	}

	float rotate, x, y, scaleX, scaleY, shearY;
	int i = Animation::search(_frames, time, TransformConstraintTimeline::ENTRIES);
	int curveType = (int) _curves[i / TransformConstraintTimeline::ENTRIES];
	switch (curveType) {
		case TransformConstraintTimeline::LINEAR: {
			float before = _frames[i];
			rotate = _frames[i + ROTATE];
			x = _frames[i + X];
			y = _frames[i + Y];
			scaleX = _frames[i + SCALEX];
			scaleY = _frames[i + SCALEY];
			shearY = _frames[i + SHEARY];
			float t = (time - before) / (_frames[i + ENTRIES] - before);
			rotate += (_frames[i + ENTRIES + ROTATE] - rotate) * t;
			x += (_frames[i + ENTRIES + X] - x) * t;
			y += (_frames[i + ENTRIES + Y] - y) * t;
			scaleX += (_frames[i + ENTRIES + SCALEX] - scaleX) * t;
			scaleY += (_frames[i + ENTRIES + SCALEY] - scaleY) * t;
			shearY += (_frames[i + ENTRIES + SHEARY] - shearY) * t;
			break;
		}
		case TransformConstraintTimeline::STEPPED: {
			rotate = _frames[i + ROTATE];
			x = _frames[i + X];
			y = _frames[i + Y];
			scaleX = _frames[i + SCALEX];
			scaleY = _frames[i + SCALEY];
			shearY = _frames[i + SHEARY];
			break;
		}
		default: {
			rotate = getBezierValue(time, i, ROTATE, curveType - BEZIER);
			x = getBezierValue(time, i, X, curveType + BEZIER_SIZE - BEZIER);
			y = getBezierValue(time, i, Y, curveType + BEZIER_SIZE * 2 - BEZIER);
			scaleX = getBezierValue(time, i, SCALEX, curveType + BEZIER_SIZE * 3 - BEZIER);
			scaleY = getBezierValue(time, i, SCALEY, curveType + BEZIER_SIZE * 4 - BEZIER);
			shearY = getBezierValue(time, i, SHEARY, curveType + BEZIER_SIZE * 5 - BEZIER);
		}
	}

	if (blend == MixBlend_Setup) {
		constraint._mixRotate = data._mixRotate + (rotate - data._mixRotate) * alpha;
		constraint._mixX = data._mixX + (x - data._mixX) * alpha;
		constraint._mixY = data._mixY + (y - data._mixY) * alpha;
		constraint._mixScaleX = data._mixScaleX + (scaleX - data._mixScaleX) * alpha;
		constraint._mixScaleY = data._mixScaleY + (scaleY - data._mixScaleY) * alpha;
		constraint._mixShearY = data._mixShearY + (shearY - data._mixShearY) * alpha;
	} else {
		constraint._mixRotate += (rotate - constraint._mixRotate) * alpha;
		constraint._mixX += (x - constraint._mixX) * alpha;
		constraint._mixY += (y - constraint._mixY) * alpha;
		constraint._mixScaleX += (scaleX - constraint._mixScaleX) * alpha;
		constraint._mixScaleY += (scaleY - constraint._mixScaleY) * alpha;
		constraint._mixShearY += (shearY - constraint._mixShearY) * alpha;
	}
}

void TransformConstraintTimeline::setFrame(size_t frame, float time, float mixRotate, float mixX, float mixY,
										   float mixScaleX, float mixScaleY, float mixShearY) {
	frame *= ENTRIES;
	_frames[frame] = time;
	_frames[frame + ROTATE] = mixRotate;
	_frames[frame + X] = mixX;
	_frames[frame + Y] = mixY;
	_frames[frame + SCALEX] = mixScaleX;
	_frames[frame + SCALEY] = mixScaleY;
	_frames[frame + SHEARY] = mixShearY;
}
