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

#include <spine/ColorTimeline.h>

#include <spine/Event.h>
#include <spine/Skeleton.h>

#include <spine/Animation.h>
#include <spine/Bone.h>
#include <spine/Property.h>
#include <spine/Slot.h>
#include <spine/SlotData.h>

using namespace spine;

RTTI_IMPL(RGBATimeline, CurveTimeline)

RGBATimeline::RGBATimeline(size_t frameCount, size_t bezierCount, int slotIndex) : CurveTimeline(frameCount,
																								 RGBATimeline::ENTRIES,
																								 bezierCount),
																				   _slotIndex(slotIndex) {
	PropertyId ids[] = {((PropertyId) Property_Rgb << 32) | slotIndex,
						((PropertyId) Property_Alpha << 32) | slotIndex};
	setPropertyIds(ids, 2);
}

RGBATimeline::~RGBATimeline() {
}

void RGBATimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						 MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Slot *slot = skeleton._slots[_slotIndex];
	if (!slot->_bone._active) return;

	if (time < _frames[0]) {
		Color &color = slot->_color, &setup = slot->_data._color;
		switch (blend) {
			case MixBlend_Setup:
				color.set(setup);
				return;
			case MixBlend_First:
				color.add((setup.r - color.r) * alpha, (setup.g - color.g) * alpha, (setup.b - color.b) * alpha,
						  (setup.a - color.a) * alpha);
			default: {
			}
		}
		return;
	}

	float r = 0, g = 0, b = 0, a = 0;
	int i = Animation::search(_frames, time, RGBATimeline::ENTRIES);
	int curveType = (int) _curves[i / RGBATimeline::ENTRIES];
	switch (curveType) {
		case RGBATimeline::LINEAR: {
			float before = _frames[i];
			r = _frames[i + RGBATimeline::R];
			g = _frames[i + RGBATimeline::G];
			b = _frames[i + RGBATimeline::B];
			a = _frames[i + RGBATimeline::A];
			float t = (time - before) / (_frames[i + RGBATimeline::ENTRIES] - before);
			r += (_frames[i + RGBATimeline::ENTRIES + RGBATimeline::R] - r) * t;
			g += (_frames[i + RGBATimeline::ENTRIES + RGBATimeline::G] - g) * t;
			b += (_frames[i + RGBATimeline::ENTRIES + RGBATimeline::B] - b) * t;
			a += (_frames[i + RGBATimeline::ENTRIES + RGBATimeline::A] - a) * t;
			break;
		}
		case RGBATimeline::STEPPED: {
			r = _frames[i + RGBATimeline::R];
			g = _frames[i + RGBATimeline::G];
			b = _frames[i + RGBATimeline::B];
			a = _frames[i + RGBATimeline::A];
			break;
		}
		default: {
			r = getBezierValue(time, i, RGBATimeline::R, curveType - RGBATimeline::BEZIER);
			g = getBezierValue(time, i, RGBATimeline::G,
							   curveType + RGBATimeline::BEZIER_SIZE - RGBATimeline::BEZIER);
			b = getBezierValue(time, i, RGBATimeline::B,
							   curveType + RGBATimeline::BEZIER_SIZE * 2 - RGBATimeline::BEZIER);
			a = getBezierValue(time, i, RGBATimeline::A,
							   curveType + RGBATimeline::BEZIER_SIZE * 3 - RGBATimeline::BEZIER);
		}
	}
	Color &color = slot->_color;
	if (alpha == 1)
		color.set(r, g, b, a);
	else {
		if (blend == MixBlend_Setup) color.set(slot->_data._color);
		color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha, (a - color.a) * alpha);
	}
}

void RGBATimeline::setFrame(int frame, float time, float r, float g, float b, float a) {
	frame *= ENTRIES;
	_frames[frame] = time;
	_frames[frame + R] = r;
	_frames[frame + G] = g;
	_frames[frame + B] = b;
	_frames[frame + A] = a;
}

RTTI_IMPL(RGBTimeline, CurveTimeline)

RGBTimeline::RGBTimeline(size_t frameCount, size_t bezierCount, int slotIndex) : CurveTimeline(frameCount,
																							   RGBTimeline::ENTRIES,
																							   bezierCount),
																				 _slotIndex(slotIndex) {
	PropertyId ids[] = {((PropertyId) Property_Rgb << 32) | slotIndex};
	setPropertyIds(ids, 1);
}

RGBTimeline::~RGBTimeline() {
}

void RGBTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Slot *slot = skeleton._slots[_slotIndex];
	if (!slot->_bone._active) return;

	if (time < _frames[0]) {
		Color &color = slot->_color, &setup = slot->_data._color;
		switch (blend) {
			case MixBlend_Setup:
				color.set(setup);
				return;
			case MixBlend_First:
				color.add((setup.r - color.r) * alpha, (setup.g - color.g) * alpha, (setup.b - color.b) * alpha,
						  (setup.a - color.a) * alpha);
			default: {
			}
		}
		return;
	}

	float r = 0, g = 0, b = 0;
	int i = Animation::search(_frames, time, RGBTimeline::ENTRIES);
	int curveType = (int) _curves[i / RGBTimeline::ENTRIES];
	switch (curveType) {
		case RGBTimeline::LINEAR: {
			float before = _frames[i];
			r = _frames[i + RGBTimeline::R];
			g = _frames[i + RGBTimeline::G];
			b = _frames[i + RGBTimeline::B];
			float t = (time - before) / (_frames[i + RGBTimeline::ENTRIES] - before);
			r += (_frames[i + RGBTimeline::ENTRIES + RGBTimeline::R] - r) * t;
			g += (_frames[i + RGBTimeline::ENTRIES + RGBTimeline::G] - g) * t;
			b += (_frames[i + RGBTimeline::ENTRIES + RGBTimeline::B] - b) * t;
			break;
		}
		case RGBTimeline::STEPPED: {
			r = _frames[i + RGBTimeline::R];
			g = _frames[i + RGBTimeline::G];
			b = _frames[i + RGBTimeline::B];
			break;
		}
		default: {
			r = getBezierValue(time, i, RGBTimeline::R, curveType - RGBTimeline::BEZIER);
			g = getBezierValue(time, i, RGBTimeline::G,
							   curveType + RGBTimeline::BEZIER_SIZE - RGBTimeline::BEZIER);
			b = getBezierValue(time, i, RGBTimeline::B,
							   curveType + RGBTimeline::BEZIER_SIZE * 2 - RGBTimeline::BEZIER);
		}
	}
	Color &color = slot->_color;
	if (alpha == 1)
		color.set(r, g, b);
	else {
		Color &setup = slot->_data._color;
		if (blend == MixBlend_Setup) color.set(setup.r, setup.g, setup.b);
		color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha);
	}
}

void RGBTimeline::setFrame(int frame, float time, float r, float g, float b) {
	frame *= ENTRIES;
	_frames[frame] = time;
	_frames[frame + R] = r;
	_frames[frame + G] = g;
	_frames[frame + B] = b;
}

RTTI_IMPL(AlphaTimeline, CurveTimeline1)

AlphaTimeline::AlphaTimeline(size_t frameCount, size_t bezierCount, int slotIndex) : CurveTimeline1(frameCount,
																									bezierCount),
																					 _slotIndex(slotIndex) {
	PropertyId ids[] = {((PropertyId) Property_Alpha << 32) | slotIndex};
	setPropertyIds(ids, 1);
}

AlphaTimeline::~AlphaTimeline() {
}

void AlphaTimeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						  MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Slot *slot = skeleton._slots[_slotIndex];
	if (!slot->_bone._active) return;

	if (time < _frames[0]) {// Time is before first frame.
		Color &color = slot->_color, &setup = slot->_data._color;
		switch (blend) {
			case MixBlend_Setup:
				color.a = setup.a;
				return;
			case MixBlend_First:
				color.a += (setup.a - color.a) * alpha;
			default: {
			}
		}
		return;
	}

	float a = getCurveValue(time);
	if (alpha == 1)
		slot->_color.a = a;
	else {
		if (blend == MixBlend_Setup) slot->_color.a = slot->_data._color.a;
		slot->_color.a += (a - slot->_color.a) * alpha;
	}
}

RTTI_IMPL(RGBA2Timeline, CurveTimeline)

RGBA2Timeline::RGBA2Timeline(size_t frameCount, size_t bezierCount, int slotIndex) : CurveTimeline(frameCount,
																								   RGBA2Timeline::ENTRIES,
																								   bezierCount),
																					 _slotIndex(slotIndex) {
	PropertyId ids[] = {((PropertyId) Property_Rgb << 32) | slotIndex,
						((PropertyId) Property_Alpha << 32) | slotIndex,
						((PropertyId) Property_Rgb2 << 32) | slotIndex};
	setPropertyIds(ids, 3);
}

RGBA2Timeline::~RGBA2Timeline() {
}

void RGBA2Timeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						  MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Slot *slot = skeleton._slots[_slotIndex];
	if (!slot->_bone._active) return;

	if (time < _frames[0]) {
		Color &light = slot->_color, &dark = slot->_darkColor, &setupLight = slot->_data._color, &setupDark = slot->_data._darkColor;
		switch (blend) {
			case MixBlend_Setup:
				light.set(setupLight);
				dark.set(setupDark.r, setupDark.g, setupDark.b);
				return;
			case MixBlend_First:
				light.add((setupLight.r - light.r) * alpha, (setupLight.g - light.g) * alpha,
						  (setupLight.b - light.b) * alpha,
						  (setupLight.a - light.a) * alpha);
				dark.r += (setupDark.r - dark.r) * alpha;
				dark.g += (setupDark.g - dark.g) * alpha;
				dark.b += (setupDark.b - dark.b) * alpha;
			default: {
			}
		}
		return;
	}

	float r = 0, g = 0, b = 0, a = 0, r2 = 0, g2 = 0, b2 = 0;
	int i = Animation::search(_frames, time, RGBA2Timeline::ENTRIES);
	int curveType = (int) _curves[i / RGBA2Timeline::ENTRIES];
	switch (curveType) {
		case RGBA2Timeline::LINEAR: {
			float before = _frames[i];
			r = _frames[i + RGBA2Timeline::R];
			g = _frames[i + RGBA2Timeline::G];
			b = _frames[i + RGBA2Timeline::B];
			a = _frames[i + RGBA2Timeline::A];
			r2 = _frames[i + RGBA2Timeline::R2];
			g2 = _frames[i + RGBA2Timeline::G2];
			b2 = _frames[i + RGBA2Timeline::B2];
			float t = (time - before) / (_frames[i + RGBA2Timeline::ENTRIES] - before);
			r += (_frames[i + RGBA2Timeline::ENTRIES + RGBA2Timeline::R] - r) * t;
			g += (_frames[i + RGBA2Timeline::ENTRIES + RGBA2Timeline::G] - g) * t;
			b += (_frames[i + RGBA2Timeline::ENTRIES + RGBA2Timeline::B] - b) * t;
			a += (_frames[i + RGBA2Timeline::ENTRIES + RGBA2Timeline::A] - a) * t;
			r2 += (_frames[i + RGBA2Timeline::ENTRIES + RGBA2Timeline::R2] - r2) * t;
			g2 += (_frames[i + RGBA2Timeline::ENTRIES + RGBA2Timeline::G2] - g2) * t;
			b2 += (_frames[i + RGBA2Timeline::ENTRIES + RGBA2Timeline::B2] - b2) * t;
			break;
		}
		case RGBA2Timeline::STEPPED: {
			r = _frames[i + RGBA2Timeline::R];
			g = _frames[i + RGBA2Timeline::G];
			b = _frames[i + RGBA2Timeline::B];
			a = _frames[i + RGBA2Timeline::A];
			r2 = _frames[i + RGBA2Timeline::R2];
			g2 = _frames[i + RGBA2Timeline::G2];
			b2 = _frames[i + RGBA2Timeline::B2];
			break;
		}
		default: {
			r = getBezierValue(time, i, RGBA2Timeline::R, curveType - RGBA2Timeline::BEZIER);
			g = getBezierValue(time, i, RGBA2Timeline::G,
							   curveType + RGBA2Timeline::BEZIER_SIZE - RGBA2Timeline::BEZIER);
			b = getBezierValue(time, i, RGBA2Timeline::B,
							   curveType + RGBA2Timeline::BEZIER_SIZE * 2 - RGBA2Timeline::BEZIER);
			a = getBezierValue(time, i, RGBA2Timeline::A,
							   curveType + RGBA2Timeline::BEZIER_SIZE * 3 - RGBA2Timeline::BEZIER);
			r2 = getBezierValue(time, i, RGBA2Timeline::R2,
								curveType + RGBA2Timeline::BEZIER_SIZE * 4 - RGBA2Timeline::BEZIER);
			g2 = getBezierValue(time, i, RGBA2Timeline::G2,
								curveType + RGBA2Timeline::BEZIER_SIZE * 5 - RGBA2Timeline::BEZIER);
			b2 = getBezierValue(time, i, RGBA2Timeline::B2,
								curveType + RGBA2Timeline::BEZIER_SIZE * 6 - RGBA2Timeline::BEZIER);
		}
	}
	Color &light = slot->_color, &dark = slot->_darkColor;
	if (alpha == 1) {
		light.set(r, g, b, a);
		dark.set(r2, g2, b2);
	} else {
		if (blend == MixBlend_Setup) {
			light.set(slot->_data._color);
			dark.set(slot->_data._darkColor);
		}
		light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha, (a - light.a) * alpha);
		dark.r += (r2 - dark.r) * alpha;
		dark.g += (g2 - dark.g) * alpha;
		dark.b += (b2 - dark.b) * alpha;
	}
}

void RGBA2Timeline::setFrame(int frame, float time, float r, float g, float b, float a, float r2, float g2, float b2) {
	frame *= ENTRIES;
	_frames[frame] = time;
	_frames[frame + R] = r;
	_frames[frame + G] = g;
	_frames[frame + B] = b;
	_frames[frame + A] = a;
	_frames[frame + R2] = r2;
	_frames[frame + G2] = g2;
	_frames[frame + B2] = b2;
}

RTTI_IMPL(RGB2Timeline, CurveTimeline)

RGB2Timeline::RGB2Timeline(size_t frameCount, size_t bezierCount, int slotIndex) : CurveTimeline(frameCount,
																								 RGB2Timeline::ENTRIES,
																								 bezierCount),
																				   _slotIndex(slotIndex) {
	PropertyId ids[] = {((PropertyId) Property_Rgb << 32) | slotIndex,
						((PropertyId) Property_Rgb2 << 32) | slotIndex};
	setPropertyIds(ids, 2);
}

RGB2Timeline::~RGB2Timeline() {
}

void RGB2Timeline::apply(Skeleton &skeleton, float lastTime, float time, Vector<Event *> *pEvents, float alpha,
						 MixBlend blend, MixDirection direction) {
	SP_UNUSED(lastTime);
	SP_UNUSED(pEvents);
	SP_UNUSED(direction);

	Slot *slot = skeleton._slots[_slotIndex];
	if (!slot->_bone._active) return;

	if (time < _frames[0]) {
		Color &light = slot->_color, &dark = slot->_darkColor, &setupLight = slot->_data._color, &setupDark = slot->_data._darkColor;
		switch (blend) {
			case MixBlend_Setup:
				light.set(setupLight.r, setupLight.g, setupLight.b);
				dark.set(setupDark.r, setupDark.g, setupDark.b);
				return;
			case MixBlend_First:
				light.add((setupLight.r - light.r) * alpha, (setupLight.g - light.g) * alpha,
						  (setupLight.b - light.b) * alpha);
				dark.r += (setupDark.r - dark.r) * alpha;
				dark.g += (setupDark.g - dark.g) * alpha;
				dark.b += (setupDark.b - dark.b) * alpha;
			default: {
			}
		}
		return;
	}

	float r = 0, g = 0, b = 0, r2 = 0, g2 = 0, b2 = 0;
	int i = Animation::search(_frames, time, RGB2Timeline::ENTRIES);
	int curveType = (int) _curves[i / RGB2Timeline::ENTRIES];
	switch (curveType) {
		case RGB2Timeline::LINEAR: {
			float before = _frames[i];
			r = _frames[i + RGB2Timeline::R];
			g = _frames[i + RGB2Timeline::G];
			b = _frames[i + RGB2Timeline::B];
			r2 = _frames[i + RGB2Timeline::R2];
			g2 = _frames[i + RGB2Timeline::G2];
			b2 = _frames[i + RGB2Timeline::B2];
			float t = (time - before) / (_frames[i + RGB2Timeline::ENTRIES] - before);
			r += (_frames[i + RGB2Timeline::ENTRIES + RGB2Timeline::R] - r) * t;
			g += (_frames[i + RGB2Timeline::ENTRIES + RGB2Timeline::G] - g) * t;
			b += (_frames[i + RGB2Timeline::ENTRIES + RGB2Timeline::B] - b) * t;
			r2 += (_frames[i + RGB2Timeline::ENTRIES + RGB2Timeline::R2] - r2) * t;
			g2 += (_frames[i + RGB2Timeline::ENTRIES + RGB2Timeline::G2] - g2) * t;
			b2 += (_frames[i + RGB2Timeline::ENTRIES + RGB2Timeline::B2] - b2) * t;
			break;
		}
		case RGB2Timeline::STEPPED: {
			r = _frames[i + RGB2Timeline::R];
			g = _frames[i + RGB2Timeline::G];
			b = _frames[i + RGB2Timeline::B];
			r2 = _frames[i + RGB2Timeline::R2];
			g2 = _frames[i + RGB2Timeline::G2];
			b2 = _frames[i + RGB2Timeline::B2];
			break;
		}
		default: {
			r = getBezierValue(time, i, RGB2Timeline::R, curveType - RGB2Timeline::BEZIER);
			g = getBezierValue(time, i, RGB2Timeline::G,
							   curveType + RGB2Timeline::BEZIER_SIZE - RGB2Timeline::BEZIER);
			b = getBezierValue(time, i, RGB2Timeline::B,
							   curveType + RGB2Timeline::BEZIER_SIZE * 2 - RGB2Timeline::BEZIER);
			r2 = getBezierValue(time, i, RGB2Timeline::R2,
								curveType + RGB2Timeline::BEZIER_SIZE * 4 - RGB2Timeline::BEZIER);
			g2 = getBezierValue(time, i, RGB2Timeline::G2,
								curveType + RGB2Timeline::BEZIER_SIZE * 5 - RGB2Timeline::BEZIER);
			b2 = getBezierValue(time, i, RGB2Timeline::B2,
								curveType + RGB2Timeline::BEZIER_SIZE * 6 - RGB2Timeline::BEZIER);
		}
	}
	Color &light = slot->_color, &dark = slot->_darkColor;
	if (alpha == 1) {
		light.set(r, g, b);
		dark.set(r2, g2, b2);
	} else {
		if (blend == MixBlend_Setup) {
			light.set(slot->_data._color.r, slot->_data._color.g, slot->_data._color.b);
			dark.set(slot->_data._darkColor);
		}
		light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha);
		dark.r += (r2 - dark.r) * alpha;
		dark.g += (g2 - dark.g) * alpha;
		dark.b += (b2 - dark.b) * alpha;
	}
}

void RGB2Timeline::setFrame(int frame, float time, float r, float g, float b, float r2, float g2, float b2) {
	frame *= ENTRIES;
	_frames[frame] = time;
	_frames[frame + R] = r;
	_frames[frame + G] = g;
	_frames[frame + B] = b;
	_frames[frame + R2] = r2;
	_frames[frame + G2] = g2;
	_frames[frame + B2] = b2;
}
