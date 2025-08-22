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

#include <spine/ScaleTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Bone.h>
#include <spine/BoneData.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

using namespace spine;

RTTI_IMPL(ScaleTimeline, CurveTimeline2)

ScaleTimeline::ScaleTimeline(size_t frameCount, size_t bezierCount, int boneIndex) : CurveTimeline2(frameCount,
																									bezierCount),
																					 _boneIndex(boneIndex) {
	PropertyId ids[] = {((PropertyId) Property_ScaleX << 32) | boneIndex,
						((PropertyId) Property_ScaleY << 32) | boneIndex};
	setPropertyIds(ids, 2);
}

ScaleTimeline::~ScaleTimeline() {}

void ScaleTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						  MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);

	Bone *bone = skeleton._bones[_boneIndex];
	if (!bone->_active) return;

	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				bone->_scaleX = bone->_data._scaleX;
				bone->_scaleY = bone->_data._scaleY;
				return;
			case MixBlend_First:
				bone->_scaleX += (bone->_data._scaleX - bone->_scaleX) * alpha;
				bone->_scaleY += (bone->_data._scaleY - bone->_scaleY) * alpha;
			default: {
			}
		}
		return;
	}

	float x, y;
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
			x = getBezierValue(time, i, CurveTimeline2::VALUE1, curveType - CurveTimeline2::BEZIER);
			y = getBezierValue(time, i, CurveTimeline2::VALUE2,
							   curveType + CurveTimeline2::BEZIER_SIZE - CurveTimeline2::BEZIER);
		}
	}
	x *= bone->_data._scaleX;
	y *= bone->_data._scaleY;

	if (alpha == 1) {
		if (blend == MixBlend_Add) {
			bone->_scaleX += x - bone->_data._scaleX;
			bone->_scaleY += y - bone->_data._scaleY;
		} else {
			bone->_scaleX = x;
			bone->_scaleY = y;
		}
	} else {
		float bx, by;
		if (direction == MixDirection_Out) {
			switch (blend) {
				case MixBlend_Setup:
					bx = bone->_data._scaleX;
					by = bone->_data._scaleY;
					bone->_scaleX = bx + (MathUtil::abs(x) * MathUtil::sign(bx) - bx) * alpha;
					bone->_scaleY = by + (MathUtil::abs(y) * MathUtil::sign(by) - by) * alpha;
					break;
				case MixBlend_First:
				case MixBlend_Replace:
					bx = bone->_scaleX;
					by = bone->_scaleY;
					bone->_scaleX = bx + (MathUtil::abs(x) * MathUtil::sign(bx) - bx) * alpha;
					bone->_scaleY = by + (MathUtil::abs(y) * MathUtil::sign(by) - by) * alpha;
					break;
				case MixBlend_Add:
					bone->_scaleX += (x - bone->_data._scaleX) * alpha;
					bone->_scaleY += (y - bone->_data._scaleY) * alpha;
			}
		} else {
			switch (blend) {
				case MixBlend_Setup:
					bx = MathUtil::abs(bone->_data._scaleX) * MathUtil::sign(x);
					by = MathUtil::abs(bone->_data._scaleY) * MathUtil::sign(y);
					bone->_scaleX = bx + (x - bx) * alpha;
					bone->_scaleY = by + (y - by) * alpha;
					break;
				case MixBlend_First:
				case MixBlend_Replace:
					bx = MathUtil::abs(bone->_scaleX) * MathUtil::sign(x);
					by = MathUtil::abs(bone->_scaleY) * MathUtil::sign(y);
					bone->_scaleX = bx + (x - bx) * alpha;
					bone->_scaleY = by + (y - by) * alpha;
					break;
				case MixBlend_Add:
					bone->_scaleX += (x - bone->_data._scaleX) * alpha;
					bone->_scaleY += (y - bone->_data._scaleY) * alpha;
			}
		}
	}
}

RTTI_IMPL(ScaleXTimeline, CurveTimeline1)

ScaleXTimeline::ScaleXTimeline(size_t frameCount, size_t bezierCount, int boneIndex) : CurveTimeline1(frameCount,
																									  bezierCount),
																					   _boneIndex(boneIndex) {
	PropertyId ids[] = {((PropertyId) Property_ScaleX << 32) | boneIndex};
	setPropertyIds(ids, 1);
}

ScaleXTimeline::~ScaleXTimeline() {}

void ScaleXTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						   MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);

	Bone *bone = skeleton._bones[_boneIndex];
	if (bone->_active) bone->_scaleX = getScaleValue(time, alpha, blend, direction, bone->_scaleX, bone->_data._scaleX);
}

RTTI_IMPL(ScaleYTimeline, CurveTimeline1)

ScaleYTimeline::ScaleYTimeline(size_t frameCount, size_t bezierCount, int boneIndex) : CurveTimeline1(frameCount,
																									  bezierCount),
																					   _boneIndex(boneIndex) {
	PropertyId ids[] = {((PropertyId) Property_ScaleY << 32) | boneIndex};
	setPropertyIds(ids, 1);
}

ScaleYTimeline::~ScaleYTimeline() {}

void ScaleYTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						   MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);

	Bone *bone = skeleton._bones[_boneIndex];
	if (bone->_active) bone->_scaleY = getScaleValue(time, alpha, blend, direction, bone->_scaleX, bone->_data._scaleY);
}