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

#include <spine/TranslateTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Bone.h>
#include <spine/BoneData.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

using namespace spine;

RTTI_IMPL(TranslateTimeline, CurveTimeline2)

TranslateTimeline::TranslateTimeline(size_t frameCount, size_t bezierCount, int boneIndex) : CurveTimeline2(frameCount,
																											bezierCount),
																							 _boneIndex(boneIndex) {
	PropertyId ids[] = {((PropertyId) Property_X << 32) | boneIndex,
						((PropertyId) Property_Y << 32) | boneIndex};
	setPropertyIds(ids, 2);
}

TranslateTimeline::~TranslateTimeline() {
}

void TranslateTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
							  MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Bone *bone = skeleton._bones[_boneIndex];
	if (!bone->_active) return;

	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				bone->_x = bone->_data._x;
				bone->_y = bone->_data._y;
				return;
			case MixBlend_First:
				bone->_x += (bone->_data._x - bone->_x) * alpha;
				bone->_y += (bone->_data._y - bone->_y) * alpha;
			default: {
			}
		}
		return;
	}

	float x = 0, y = 0;
	int i = Animation::search(_frames, time, CurveTimeline2::ENTRIES);
	int curveType = (int) _curves[i / CurveTimeline2::ENTRIES];
	switch (curveType) {
		case CurveTimeline::LINEAR: {
			float before = _frames[i];
			x = _frames[i + CurveTimeline2::VALUE1];
			y = _frames[i + CurveTimeline2::VALUE2];
			float t = (time - before) / (_frames[i + CurveTimeline2::ENTRIES] - before);
			x += (_frames[i + CurveTimeline2::ENTRIES + CurveTimeline2::VALUE1] - x) * t;
			y += (_frames[i + CurveTimeline2::ENTRIES + CurveTimeline2::VALUE2] - y) * t;
			break;
		}
		case CurveTimeline::STEPPED: {
			x = _frames[i + CurveTimeline2::VALUE1];
			y = _frames[i + CurveTimeline2::VALUE2];
			break;
		}
		default: {
			x = getBezierValue(time, i, CurveTimeline2::VALUE1, curveType - CurveTimeline::BEZIER);
			y = getBezierValue(time, i, CurveTimeline2::VALUE2,
							   curveType + CurveTimeline::BEZIER_SIZE - CurveTimeline::BEZIER);
		}
	}

	switch (blend) {
		case MixBlend_Setup:
			bone->_x = bone->_data._x + x * alpha;
			bone->_y = bone->_data._y + y * alpha;
			break;
		case MixBlend_First:
		case MixBlend_Replace:
			bone->_x += (bone->_data._x + x - bone->_x) * alpha;
			bone->_y += (bone->_data._y + y - bone->_y) * alpha;
			break;
		case MixBlend_Add:
			bone->_x += x * alpha;
			bone->_y += y * alpha;
	}
}

RTTI_IMPL(TranslateXTimeline, CurveTimeline1)

TranslateXTimeline::TranslateXTimeline(size_t frameCount, size_t bezierCount, int boneIndex) : CurveTimeline1(
																									   frameCount, bezierCount),
																							   _boneIndex(boneIndex) {
	PropertyId ids[] = {((PropertyId) Property_X << 32) | boneIndex};
	setPropertyIds(ids, 1);
}

TranslateXTimeline::~TranslateXTimeline() {
}

void TranslateXTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
							   MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Bone *bone = skeleton._bones[_boneIndex];
	if (bone->_active) bone->_x = getRelativeValue(time, alpha, blend, bone->_x, bone->_data._x);
}

RTTI_IMPL(TranslateYTimeline, CurveTimeline1)

TranslateYTimeline::TranslateYTimeline(size_t frameCount, size_t bezierCount, int boneIndex) : CurveTimeline1(
																									   frameCount, bezierCount),
																							   _boneIndex(boneIndex) {
	PropertyId ids[] = {((PropertyId) Property_Y << 32) | boneIndex};
	setPropertyIds(ids, 1);
}

TranslateYTimeline::~TranslateYTimeline() {
}

void TranslateYTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
							   MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Bone *bone = skeleton._bones[_boneIndex];
	if (bone->_active) bone->_y = getRelativeValue(time, alpha, blend, bone->_y, bone->_data._y);
}
