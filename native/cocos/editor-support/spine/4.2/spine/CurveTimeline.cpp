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

#include <spine/CurveTimeline.h>

#include <spine/MathUtil.h>

using namespace spine;

RTTI_IMPL(CurveTimeline, Timeline)

CurveTimeline::CurveTimeline(size_t frameCount, size_t frameEntries, size_t bezierCount) : Timeline(frameCount,
																									frameEntries) {
	_curves.setSize(frameCount + bezierCount * BEZIER_SIZE, 0);
	_curves[frameCount - 1] = STEPPED;
}

CurveTimeline::~CurveTimeline() {
}

void CurveTimeline::setLinear(size_t frame) {
	_curves[frame] = LINEAR;
}

void CurveTimeline::setStepped(size_t frame) {
	_curves[frame] = STEPPED;
}

void CurveTimeline::setBezier(size_t bezier, size_t frame, float value, float time1, float value1, float cx1, float cy1,
							  float cx2, float cy2, float time2, float value2) {
	size_t i = getFrameCount() + bezier * BEZIER_SIZE;
	if (value == 0) _curves[frame] = BEZIER + i;
	float tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = (value1 - cy1 * 2 + cy2) * 0.03;
	float dddx = ((cx1 - cx2) * 3 - time1 + time2) * 0.006, dddy = ((cy1 - cy2) * 3 - value1 + value2) * 0.006;
	float ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
	float dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = (cy1 - value1) * 0.3 + tmpy + dddy * 0.16666667;
	float x = time1 + dx, y = value1 + dy;
	for (size_t n = i + BEZIER_SIZE; i < n; i += 2) {
		_curves[i] = x;
		_curves[i + 1] = y;
		dx += ddx;
		dy += ddy;
		ddx += dddx;
		ddy += dddy;
		x += dx;
		y += dy;
	}
}

float CurveTimeline::getBezierValue(float time, size_t frameIndex, size_t valueOffset, size_t i) {
	if (_curves[i] > time) {
		float x = _frames[frameIndex], y = _frames[frameIndex + valueOffset];
		return y + (time - x) / (_curves[i] - x) * (_curves[i + 1] - y);
	}
	size_t n = i + BEZIER_SIZE;
	for (i += 2; i < n; i += 2) {
		if (_curves[i] >= time) {
			float x = _curves[i - 2], y = _curves[i - 1];
			return y + (time - x) / (_curves[i] - x) * (_curves[i + 1] - y);
		}
	}
	frameIndex += getFrameEntries();
	float x = _curves[n - 2], y = _curves[n - 1];
	return y + (time - x) / (_frames[frameIndex] - x) * (_frames[frameIndex + valueOffset] - y);
}

Vector<float> &CurveTimeline::getCurves() {
	return _curves;
}

RTTI_IMPL(CurveTimeline1, CurveTimeline)

CurveTimeline1::CurveTimeline1(size_t frameCount, size_t bezierCount) : CurveTimeline(frameCount,
																					  CurveTimeline1::ENTRIES,
																					  bezierCount) {
}

CurveTimeline1::~CurveTimeline1() {
}

void CurveTimeline1::setFrame(size_t frame, float time, float value) {
	frame <<= 1;
	_frames[frame] = time;
	_frames[frame + CurveTimeline1::VALUE] = value;
}

float CurveTimeline1::getCurveValue(float time) {
	int i = (int) _frames.size() - 2;
	for (int ii = 2; ii <= i; ii += 2) {
		if (_frames[ii] > time) {
			i = ii - 2;
			break;
		}
	}

	int curveType = (int) _curves[i >> 1];
	switch (curveType) {
		case CurveTimeline::LINEAR: {
			float before = _frames[i], value = _frames[i + CurveTimeline1::VALUE];
			return value + (time - before) / (_frames[i + CurveTimeline1::ENTRIES] - before) *
								   (_frames[i + CurveTimeline1::ENTRIES + CurveTimeline1::VALUE] - value);
		}
		case CurveTimeline::STEPPED:
			return _frames[i + CurveTimeline1::VALUE];
	}
	return getBezierValue(time, i, CurveTimeline1::VALUE, curveType - CurveTimeline1::BEZIER);
}

float CurveTimeline1::getRelativeValue(float time, float alpha, MixBlend blend, float current, float setup) {
	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				return setup;
			case MixBlend_First:
				return current + (setup - current) * alpha;
			default:
				return current;
		}
	}
	float value = getCurveValue(time);
	switch (blend) {
		case MixBlend_Setup:
			return setup + value * alpha;
		case MixBlend_First:
		case MixBlend_Replace:
			value += setup - current;
			break;
		case MixBlend_Add:
			break;
	}
	return current + value * alpha;
}

float CurveTimeline1::getAbsoluteValue(float time, float alpha, MixBlend blend, float current, float setup) {
	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				return setup;
			case MixBlend_First:
				return current + (setup - current) * alpha;
			default:
				return current;
		}
	}
	float value = getCurveValue(time);
	if (blend == MixBlend_Setup) return setup + (value - setup) * alpha;
	return current + (value - current) * alpha;
}

float CurveTimeline1::getAbsoluteValue(float time, float alpha, MixBlend blend, float current, float setup, float value) {
	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				return setup;
			case MixBlend_First:
				return current + (setup - current) * alpha;
			default:
				return current;
		}
	}
	if (blend == MixBlend_Setup) return setup + (value - setup) * alpha;
	return current + (value - current) * alpha;
}

float CurveTimeline1::getScaleValue(float time, float alpha, MixBlend blend, MixDirection direction, float current,
									float setup) {
	if (time < _frames[0]) {
		switch (blend) {
			case MixBlend_Setup:
				return setup;
			case MixBlend_First:
				return current + (setup - current) * alpha;
			default:
				return current;
		}
	}
	float value = getCurveValue(time) * setup;
	if (alpha == 1) {
		if (blend == MixBlend_Add) return current + value - setup;
		return value;
	}
	// Mixing out uses sign of setup or current pose, else use sign of key.
	if (direction == MixDirection_Out) {
		switch (blend) {
			case MixBlend_Setup:
				return setup + (MathUtil::abs(value) * MathUtil::sign(setup) - setup) * alpha;
			case MixBlend_First:
			case MixBlend_Replace:
				return current + (MathUtil::abs(value) * MathUtil::sign(current) - current) * alpha;
			default:
				break;
		}
	} else {
		float s;
		switch (blend) {
			case MixBlend_Setup:
				s = MathUtil::abs(setup) * MathUtil::sign(value);
				return s + (value - s) * alpha;
			case MixBlend_First:
			case MixBlend_Replace:
				s = MathUtil::abs(current) * MathUtil::sign(value);
				return s + (value - s) * alpha;
			default:
				break;
		}
	}
	return current + (value - setup) * alpha;
}


RTTI_IMPL(CurveTimeline2, CurveTimeline)

CurveTimeline2::CurveTimeline2(size_t frameCount, size_t bezierCount) : CurveTimeline(frameCount,
																					  CurveTimeline2::ENTRIES,
																					  bezierCount) {
}

CurveTimeline2::~CurveTimeline2() {
}

void CurveTimeline2::setFrame(size_t frame, float time, float value1, float value2) {
	frame *= CurveTimeline2::ENTRIES;
	_frames[frame] = time;
	_frames[frame + CurveTimeline2::VALUE1] = value1;
	_frames[frame + CurveTimeline2::VALUE2] = value2;
}
