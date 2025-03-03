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

#include <spine/TransformConstraint.h>

#include <spine/Bone.h>
#include <spine/Skeleton.h>
#include <spine/TransformConstraintData.h>

#include <spine/BoneData.h>

using namespace spine;

RTTI_IMPL(TransformConstraint, Updatable)

TransformConstraint::TransformConstraint(TransformConstraintData &data, Skeleton &skeleton) : Updatable(),
																							  _data(data),
																							  _target(skeleton.findBone(
																									  data.getTarget()->getName())),
																							  _mixRotate(
																									  data.getMixRotate()),
																							  _mixX(data.getMixX()),
																							  _mixY(data.getMixY()),
																							  _mixScaleX(
																									  data.getMixScaleX()),
																							  _mixScaleY(
																									  data.getMixScaleY()),
																							  _mixShearY(
																									  data.getMixShearY()),
																							  _active(false) {
	_bones.ensureCapacity(_data.getBones().size());
	for (size_t i = 0; i < _data.getBones().size(); ++i) {
		BoneData *boneData = _data.getBones()[i];
		_bones.add(skeleton.findBone(boneData->getName()));
	}
}

void TransformConstraint::update(Physics) {
	if (_mixRotate == 0 && _mixX == 0 && _mixY == 0 && _mixScaleX == 0 && _mixScaleY == 0 && _mixShearY == 0) return;

	if (_data.isLocal()) {
		if (_data.isRelative())
			applyRelativeLocal();
		else
			applyAbsoluteLocal();
	} else {
		if (_data.isRelative())
			applyRelativeWorld();
		else
			applyAbsoluteWorld();
	}
}

int TransformConstraint::getOrder() {
	return (int) _data.getOrder();
}

TransformConstraintData &TransformConstraint::getData() {
	return _data;
}

Vector<Bone *> &TransformConstraint::getBones() {
	return _bones;
}

Bone *TransformConstraint::getTarget() {
	return _target;
}

void TransformConstraint::setTarget(Bone *inValue) {
	_target = inValue;
}

float TransformConstraint::getMixRotate() {
	return _mixRotate;
}

void TransformConstraint::setMixRotate(float inValue) {
	_mixRotate = inValue;
}

float TransformConstraint::getMixX() {
	return _mixX;
}

void TransformConstraint::setMixX(float inValue) {
	_mixX = inValue;
}

float TransformConstraint::getMixY() {
	return _mixY;
}

void TransformConstraint::setMixY(float inValue) {
	_mixY = inValue;
}

void TransformConstraint::setMixScaleX(float inValue) {
	_mixScaleX = inValue;
}

float TransformConstraint::getMixScaleX() {
	return _mixScaleX;
}

float TransformConstraint::getMixScaleY() {
	return _mixScaleY;
}

void TransformConstraint::setMixScaleY(float inValue) {
	_mixScaleY = inValue;
}

float TransformConstraint::getMixShearY() {
	return _mixShearY;
}

void TransformConstraint::setMixShearY(float inValue) {
	_mixShearY = inValue;
}

void TransformConstraint::applyAbsoluteWorld() {
	float mixRotate = _mixRotate, mixX = _mixX, mixY = _mixY, mixScaleX = _mixScaleX, mixScaleY = _mixScaleY, mixShearY = _mixShearY;
	bool translate = mixX != 0 || mixY != 0;
	Bone &target = *_target;
	float ta = target._a, tb = target._b, tc = target._c, td = target._d;
	float degRadReflect = ta * td - tb * tc > 0 ? MathUtil::Deg_Rad : -MathUtil::Deg_Rad;
	float offsetRotation = _data._offsetRotation * degRadReflect, offsetShearY = _data._offsetShearY * degRadReflect;

	for (size_t i = 0; i < _bones.size(); ++i) {
		Bone *item = _bones[i];
		Bone &bone = *item;

		if (mixRotate != 0) {
			float a = bone._a, b = bone._b, c = bone._c, d = bone._d;
			float r = MathUtil::atan2(tc, ta) - MathUtil::atan2(c, a) + offsetRotation;
			if (r > MathUtil::Pi)
				r -= MathUtil::Pi_2;
			else if (r < -MathUtil::Pi)
				r += MathUtil::Pi_2;

			r *= mixRotate;
			float cos = MathUtil::cos(r), sin = MathUtil::sin(r);
			bone._a = cos * a - sin * c;
			bone._b = cos * b - sin * d;
			bone._c = sin * a + cos * c;
			bone._d = sin * b + cos * d;
		}

		if (translate) {
			float tx, ty;
			target.localToWorld(_data._offsetX, _data._offsetY, tx, ty);
			bone._worldX += (tx - bone._worldX) * mixX;
			bone._worldY += (ty - bone._worldY) * mixY;
		}

		if (mixScaleX > 0) {
			float s = MathUtil::sqrt(bone._a * bone._a + bone._c * bone._c);
			if (s != 0) s = (s + (MathUtil::sqrt(ta * ta + tc * tc) - s + _data._offsetScaleX) * mixScaleX) / s;
			bone._a *= s;
			bone._c *= s;
		}

		if (mixScaleY > 0) {
			float s = MathUtil::sqrt(bone._b * bone._b + bone._d * bone._d);
			if (s != 0) s = (s + (MathUtil::sqrt(tb * tb + td * td) - s + _data._offsetScaleY) * mixScaleY) / s;
			bone._b *= s;
			bone._d *= s;
		}

		if (mixShearY > 0) {
			float b = bone._b, d = bone._d;
			float by = MathUtil::atan2(d, b);
			float r = MathUtil::atan2(td, tb) - MathUtil::atan2(tc, ta) - (by - MathUtil::atan2(bone._c, bone._a));
			if (r > MathUtil::Pi)
				r -= MathUtil::Pi_2;
			else if (r < -MathUtil::Pi)
				r += MathUtil::Pi_2;

			r = by + (r + offsetShearY) * mixShearY;
			float s = MathUtil::sqrt(b * b + d * d);
			bone._b = MathUtil::cos(r) * s;
			bone._d = MathUtil::sin(r) * s;
		}

		bone.updateAppliedTransform();
	}
}

void TransformConstraint::applyRelativeWorld() {
	float mixRotate = _mixRotate, mixX = _mixX, mixY = _mixY, mixScaleX = _mixScaleX, mixScaleY = _mixScaleY, mixShearY = _mixShearY;
	bool translate = mixX != 0 || mixY != 0;
	Bone &target = *_target;
	float ta = target._a, tb = target._b, tc = target._c, td = target._d;
	float degRadReflect = ta * td - tb * tc > 0 ? MathUtil::Deg_Rad : -MathUtil::Deg_Rad;
	float offsetRotation = _data._offsetRotation * degRadReflect, offsetShearY = _data._offsetShearY * degRadReflect;
	for (size_t i = 0; i < _bones.size(); ++i) {
		Bone *item = _bones[i];
		Bone &bone = *item;

		if (mixRotate != 0) {
			float a = bone._a, b = bone._b, c = bone._c, d = bone._d;
			float r = MathUtil::atan2(tc, ta) + offsetRotation;
			if (r > MathUtil::Pi)
				r -= MathUtil::Pi_2;
			else if (r < -MathUtil::Pi)
				r += MathUtil::Pi_2;

			r *= mixRotate;
			float cos = MathUtil::cos(r), sin = MathUtil::sin(r);
			bone._a = cos * a - sin * c;
			bone._b = cos * b - sin * d;
			bone._c = sin * a + cos * c;
			bone._d = sin * b + cos * d;
		}

		if (translate) {
			float tx, ty;
			target.localToWorld(_data._offsetX, _data._offsetY, tx, ty);
			bone._worldX += tx * mixX;
			bone._worldY += ty * mixY;
		}

		if (mixScaleX != 0) {
			float s = (MathUtil::sqrt(ta * ta + tc * tc) - 1 + _data._offsetScaleX) * mixScaleX + 1;
			bone._a *= s;
			bone._c *= s;
		}
		if (mixScaleY != 0) {
			float s = (MathUtil::sqrt(tb * tb + td * td) - 1 + _data._offsetScaleY) * mixScaleY + 1;
			bone._b *= s;
			bone._d *= s;
		}

		if (mixShearY > 0) {
			float r = MathUtil::atan2(td, tb) - MathUtil::atan2(tc, ta);
			if (r > MathUtil::Pi)
				r -= MathUtil::Pi_2;
			else if (r < -MathUtil::Pi)
				r += MathUtil::Pi_2;

			float b = bone._b, d = bone._d;
			r = MathUtil::atan2(d, b) + (r - MathUtil::Pi / 2 + offsetShearY) * mixShearY;
			float s = MathUtil::sqrt(b * b + d * d);
			bone._b = MathUtil::cos(r) * s;
			bone._d = MathUtil::sin(r) * s;
		}

		bone.updateAppliedTransform();
	}
}

void TransformConstraint::applyAbsoluteLocal() {
	float mixRotate = _mixRotate, mixX = _mixX, mixY = _mixY, mixScaleX = _mixScaleX, mixScaleY = _mixScaleY, mixShearY = _mixShearY;
	Bone &target = *_target;

	for (size_t i = 0; i < _bones.size(); ++i) {
		Bone *item = _bones[i];
		Bone &bone = *item;

		float rotation = bone._arotation;
		if (mixRotate != 0) {
			float r = target._arotation - rotation + _data._offsetRotation;
			r -= MathUtil::ceil(r / 360 - 0.5) * 360;
			rotation += r * mixRotate;
		}

		float x = bone._ax, y = bone._ay;
		x += (target._ax - x + _data._offsetX) * mixX;
		y += (target._ay - y + _data._offsetY) * mixY;

		float scaleX = bone._ascaleX, scaleY = bone._ascaleY;
		if (mixScaleX != 0 && scaleX != 0)
			scaleX = (scaleX + (target._ascaleX - scaleX + _data._offsetScaleX) * mixScaleX) / scaleX;
		if (mixScaleY != 0 && scaleY != 0)
			scaleY = (scaleY + (target._ascaleY - scaleY + _data._offsetScaleY) * mixScaleY) / scaleY;

		float shearY = bone._ashearY;
		if (mixShearY != 0) {
			float r = target._ashearY - shearY + _data._offsetShearY;
			r -= MathUtil::ceil(r / 360 - 0.5) * 360;
			bone._shearY += r * mixShearY;
		}

		bone.updateWorldTransform(x, y, rotation, scaleX, scaleY, bone._ashearX, shearY);
	}
}

void TransformConstraint::applyRelativeLocal() {
	float mixRotate = _mixRotate, mixX = _mixX, mixY = _mixY, mixScaleX = _mixScaleX, mixScaleY = _mixScaleY, mixShearY = _mixShearY;
	Bone &target = *_target;

	for (size_t i = 0; i < _bones.size(); ++i) {
		Bone *item = _bones[i];
		Bone &bone = *item;

		float rotation = bone._arotation + (target._arotation + _data._offsetRotation) * mixRotate;
		float x = bone._ax + (target._ax + _data._offsetX) * mixX;
		float y = bone._ay + (target._ay + _data._offsetY) * mixY;
		float scaleX = bone._ascaleX * (((target._ascaleX - 1 + _data._offsetScaleX) * mixScaleX) + 1);
		float scaleY = bone._ascaleY * (((target._ascaleY - 1 + _data._offsetScaleY) * mixScaleY) + 1);
		float shearY = bone._ashearY + (target._ashearY + _data._offsetShearY) * mixShearY;

		bone.updateWorldTransform(x, y, rotation, scaleX, scaleY, bone._ashearX, shearY);
	}
}

bool TransformConstraint::isActive() {
	return _active;
}

void TransformConstraint::setActive(bool inValue) {
	_active = inValue;
}

void TransformConstraint::setToSetupPose() {
	TransformConstraintData &data = this->_data;
	this->_mixRotate = data._mixRotate;
	this->_mixX = data._mixX;
	this->_mixY = data._mixY;
	this->_mixScaleX = data._mixScaleX;
	this->_mixScaleY = data._mixScaleY;
	this->_mixShearY = data._mixShearY;
}
