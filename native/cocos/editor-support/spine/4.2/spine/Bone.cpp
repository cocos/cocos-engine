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

#include <spine/Bone.h>

#include <spine/BoneData.h>
#include <spine/Skeleton.h>

using namespace spine;

RTTI_IMPL(Bone, Updatable)

bool Bone::yDown = false;

void Bone::setYDown(bool inValue) {
	yDown = inValue;
}

bool Bone::isYDown() {
	return yDown;
}

Bone::Bone(BoneData &data, Skeleton &skeleton, Bone *parent) : Updatable(),
															   _data(data),
															   _skeleton(skeleton),
															   _parent(parent),
															   _x(0),
															   _y(0),
															   _rotation(0),
															   _scaleX(0),
															   _scaleY(0),
															   _shearX(0),
															   _shearY(0),
															   _ax(0),
															   _ay(0),
															   _arotation(0),
															   _ascaleX(0),
															   _ascaleY(0),
															   _ashearX(0),
															   _ashearY(0),
															   _a(1),
															   _b(0),
															   _worldX(0),
															   _c(0),
															   _d(1),
															   _worldY(0),
															   _sorted(false),
															   _active(false),
															   _inherit(Inherit_Normal) {
	setToSetupPose();
}

void Bone::update(Physics) {
	updateWorldTransform(_ax, _ay, _arotation, _ascaleX, _ascaleY, _ashearX, _ashearY);
}

void Bone::updateWorldTransform() {
	updateWorldTransform(_x, _y, _rotation, _scaleX, _scaleY, _shearX, _shearY);
}

void Bone::updateWorldTransform(float x, float y, float rotation, float scaleX, float scaleY, float shearX, float shearY) {
	float pa, pb, pc, pd;
	Bone *parent = _parent;

	_ax = x;
	_ay = y;
	_arotation = rotation;
	_ascaleX = scaleX;
	_ascaleY = scaleY;
	_ashearX = shearX;
	_ashearY = shearY;

	if (!parent) { /* Root bone. */
		Skeleton &skeleton = this->_skeleton;
		float sx = skeleton.getScaleX();
		float sy = skeleton.getScaleY();
		float rx = (rotation + shearX) * MathUtil::Deg_Rad;
		float ry = (rotation + 90 + shearY) * MathUtil::Deg_Rad;
		_a = MathUtil::cos(rx) * scaleX * sx;
		_b = MathUtil::cos(ry) * scaleY * sx;
		_c = MathUtil::sin(rx) * scaleX * sy;
		_d = MathUtil::sin(ry) * scaleY * sy;
		_worldX = x * sx + _skeleton.getX();
		_worldY = y * sy + _skeleton.getY();
		return;
	}

	pa = parent->_a;
	pb = parent->_b;
	pc = parent->_c;
	pd = parent->_d;

	_worldX = pa * x + pb * y + parent->_worldX;
	_worldY = pc * x + pd * y + parent->_worldY;

	switch (_inherit) {
		case Inherit_Normal: {
			float rx = (rotation + shearX) * MathUtil::Deg_Rad;
			float ry = (rotation + 90 + shearY) * MathUtil::Deg_Rad;
			float la = MathUtil::cos(rx) * scaleX;
			float lb = MathUtil::cos(ry) * scaleY;
			float lc = MathUtil::sin(rx) * scaleX;
			float ld = MathUtil::sin(ry) * scaleY;
			_a = pa * la + pb * lc;
			_b = pa * lb + pb * ld;
			_c = pc * la + pd * lc;
			_d = pc * lb + pd * ld;
			return;
		}
		case Inherit_OnlyTranslation: {
			float rx = (rotation + shearX) * MathUtil::Deg_Rad;
			float ry = (rotation + 90 + shearY) * MathUtil::Deg_Rad;
			_a = MathUtil::cos(rx) * scaleX;
			_b = MathUtil::cos(ry) * scaleY;
			_c = MathUtil::sin(rx) * scaleX;
			_d = MathUtil::sin(ry) * scaleY;
			break;
		}
		case Inherit_NoRotationOrReflection: {
			float s = pa * pa + pc * pc;
			float prx;
			if (s > 0.0001f) {
				s = MathUtil::abs(pa * pd - pb * pc) / s;
				pa /= _skeleton.getScaleX();
				pc /= _skeleton.getScaleY();
				pb = pc * s;
				pd = pa * s;
				prx = MathUtil::atan2Deg(pc, pa);
			} else {
				pa = 0;
				pc = 0;
				prx = 90 - MathUtil::atan2Deg(pd, pb);
			}
			float rx = (rotation + shearX - prx) * MathUtil::Deg_Rad;
			float ry = (rotation + shearY - prx + 90) * MathUtil::Deg_Rad;
			float la = MathUtil::cos(rx) * scaleX;
			float lb = MathUtil::cos(ry) * scaleY;
			float lc = MathUtil::sin(rx) * scaleX;
			float ld = MathUtil::sin(ry) * scaleY;
			_a = pa * la - pb * lc;
			_b = pa * lb - pb * ld;
			_c = pc * la + pd * lc;
			_d = pc * lb + pd * ld;
			break;
		}
		case Inherit_NoScale:
		case Inherit_NoScaleOrReflection: {
			rotation *= MathUtil::Deg_Rad;
			float cosine = MathUtil::cos(rotation);
			float sine = MathUtil::sin(rotation);
			float za = (pa * cosine + pb * sine) / _skeleton.getScaleX();
			float zc = (pc * cosine + pd * sine) / _skeleton.getScaleY();
			float s = MathUtil::sqrt(za * za + zc * zc);
			if (s > 0.00001f) s = 1 / s;
			za *= s;
			zc *= s;
			s = MathUtil::sqrt(za * za + zc * zc);
			if (_inherit == Inherit_NoScale &&
				(pa * pd - pb * pc < 0) != (_skeleton.getScaleX() < 0 != _skeleton.getScaleY() < 0))
				s = -s;
			rotation = MathUtil::Pi / 2 + MathUtil::atan2(zc, za);
			float zb = MathUtil::cos(rotation) * s;
			float zd = MathUtil::sin(rotation) * s;
			shearX *= MathUtil::Deg_Rad;
			shearY = (90 + shearY) * MathUtil::Deg_Rad;
			float la = MathUtil::cos(shearX) * scaleX;
			float lb = MathUtil::cos(shearY) * scaleY;
			float lc = MathUtil::sin(shearX) * scaleX;
			float ld = MathUtil::sin(shearY) * scaleY;
			_a = za * la + zb * lc;
			_b = za * lb + zb * ld;
			_c = zc * la + zd * lc;
			_d = zc * lb + zd * ld;
		}
	}
	_a *= _skeleton.getScaleX();
	_b *= _skeleton.getScaleX();
	_c *= _skeleton.getScaleY();
	_d *= _skeleton.getScaleY();
}

void Bone::setToSetupPose() {
	BoneData &data = _data;
	_x = data.getX();
	_y = data.getY();
	_rotation = data.getRotation();
	_scaleX = data.getScaleX();
	_scaleY = data.getScaleY();
	_shearX = data.getShearX();
	_shearY = data.getShearY();
	_inherit = data.getInherit();
}

void Bone::worldToLocal(float worldX, float worldY, float &outLocalX, float &outLocalY) {
	float a = _a;
	float b = _b;
	float c = _c;
	float d = _d;

	float invDet = 1 / (a * d - b * c);
	float x = worldX - _worldX;
	float y = worldY - _worldY;

	outLocalX = (x * d * invDet - y * b * invDet);
	outLocalY = (y * a * invDet - x * c * invDet);
}

void Bone::worldToParent(float worldX, float worldY, float &outParentX, float &outParentY) {
	if (!_parent) {
		outParentX = worldX;
		outParentY = worldY;
	} else {
		_parent->worldToLocal(worldX, worldY, outParentX, outParentY);
	}
}

void Bone::localToWorld(float localX, float localY, float &outWorldX, float &outWorldY) {
	outWorldX = localX * _a + localY * _b + _worldX;
	outWorldY = localX * _c + localY * _d + _worldY;
}

void Bone::parentToWorld(float worldX, float worldY, float &outX, float &outY) {
	if (!_parent) {
		outX = worldX;
		outY = worldY;
	} else {
		_parent->localToWorld(worldX, worldY, outX, outY);
	}
}

float Bone::worldToLocalRotation(float worldRotation) {
	worldRotation *= MathUtil::Deg_Rad;
	float sine = MathUtil::sin(worldRotation), cosine = MathUtil::cos(worldRotation);
	return MathUtil::atan2Deg(_a * sine - _c * cosine, _d * cosine - _b * sine) + _rotation - _shearX;
}

float Bone::localToWorldRotation(float localRotation) {
	localRotation = (localRotation - _rotation - _shearX) * MathUtil::Deg_Rad;
	float sine = MathUtil::sin(localRotation), cosine = MathUtil::cos(localRotation);
	return MathUtil::atan2Deg(cosine * _c + sine * _d, cosine * _a + sine * _b);
}

void Bone::rotateWorld(float degrees) {
	degrees *= MathUtil::Deg_Rad;
	float sine = MathUtil::sin(degrees), cosine = MathUtil::cos(degrees);
	float ra = _a, rb = _b;
	_a = cosine * ra - sine * _c;
	_b = cosine * rb - sine * _d;
	_c = sine * ra + cosine * _c;
	_d = sine * rb + cosine * _d;
}

float Bone::getWorldToLocalRotationX() {
	Bone *parent = _parent;
	if (!parent) {
		return _arotation;
	}

	float pa = parent->_a;
	float pb = parent->_b;
	float pc = parent->_c;
	float pd = parent->_d;
	float a = _a;
	float c = _c;

	return MathUtil::atan2(pa * c - pc * a, pd * a - pb * c) * MathUtil::Rad_Deg;
}

float Bone::getWorldToLocalRotationY() {
	Bone *parent = _parent;
	if (!parent) {
		return _arotation;
	}

	float pa = parent->_a;
	float pb = parent->_b;
	float pc = parent->_c;
	float pd = parent->_d;
	float b = _b;
	float d = _d;

	return MathUtil::atan2(pa * d - pc * b, pd * b - pb * d) * MathUtil::Rad_Deg;
}

BoneData &Bone::getData() {
	return _data;
}

Skeleton &Bone::getSkeleton() {
	return _skeleton;
}

Bone *Bone::getParent() {
	return _parent;
}

Vector<Bone *> &Bone::getChildren() {
	return _children;
}

float Bone::getX() {
	return _x;
}

void Bone::setX(float inValue) {
	_x = inValue;
}

float Bone::getY() {
	return _y;
}

void Bone::setY(float inValue) {
	_y = inValue;
}

float Bone::getRotation() {
	return _rotation;
}

void Bone::setRotation(float inValue) {
	_rotation = inValue;
}

float Bone::getScaleX() {
	return _scaleX;
}

void Bone::setScaleX(float inValue) {
	_scaleX = inValue;
}

float Bone::getScaleY() {
	return _scaleY;
}

void Bone::setScaleY(float inValue) {
	_scaleY = inValue;
}

float Bone::getShearX() {
	return _shearX;
}

void Bone::setShearX(float inValue) {
	_shearX = inValue;
}

float Bone::getShearY() {
	return _shearY;
}

void Bone::setShearY(float inValue) {
	_shearY = inValue;
}

float Bone::getAppliedRotation() {
	return _arotation;
}

void Bone::setAppliedRotation(float inValue) {
	_arotation = inValue;
}

float Bone::getAX() {
	return _ax;
}

void Bone::setAX(float inValue) {
	_ax = inValue;
}

float Bone::getAY() {
	return _ay;
}

void Bone::setAY(float inValue) {
	_ay = inValue;
}

float Bone::getAScaleX() {
	return _ascaleX;
}

void Bone::setAScaleX(float inValue) {
	_ascaleX = inValue;
}

float Bone::getAScaleY() {
	return _ascaleY;
}

void Bone::setAScaleY(float inValue) {
	_ascaleY = inValue;
}

float Bone::getAShearX() {
	return _ashearX;
}

void Bone::setAShearX(float inValue) {
	_ashearX = inValue;
}

float Bone::getAShearY() {
	return _ashearY;
}

void Bone::setAShearY(float inValue) {
	_ashearY = inValue;
}

float Bone::getA() {
	return _a;
}

void Bone::setA(float inValue) {
	_a = inValue;
}

float Bone::getB() {
	return _b;
}

void Bone::setB(float inValue) {
	_b = inValue;
}

float Bone::getC() {
	return _c;
}

void Bone::setC(float inValue) {
	_c = inValue;
}

float Bone::getD() {
	return _d;
}

void Bone::setD(float inValue) {
	_d = inValue;
}

float Bone::getWorldX() {
	return _worldX;
}

void Bone::setWorldX(float inValue) {
	_worldX = inValue;
}

float Bone::getWorldY() {
	return _worldY;
}

void Bone::setWorldY(float inValue) {
	_worldY = inValue;
}

float Bone::getWorldRotationX() {
	return MathUtil::atan2Deg(_c, _a);
}

float Bone::getWorldRotationY() {
	return MathUtil::atan2Deg(_d, _b);
}

float Bone::getWorldScaleX() {
	return MathUtil::sqrt(_a * _a + _c * _c);
}

float Bone::getWorldScaleY() {
	return MathUtil::sqrt(_b * _b + _d * _d);
}

void Bone::updateAppliedTransform() {
	Bone *parent = _parent;
	if (!parent) {
		_ax = _worldX - _skeleton.getX();
		_ay = _worldY - _skeleton.getY();
		_arotation = MathUtil::atan2Deg(_c, _a);
		_ascaleX = MathUtil::sqrt(_a * _a + _c * _c);
		_ascaleY = MathUtil::sqrt(_b * _b + _d * _d);
		_ashearX = 0;
		_ashearY = MathUtil::atan2Deg(_a * _b + _c * _d, _a * _d - _b * _c);
	}
	float pa = parent->_a, pb = parent->_b, pc = parent->_c, pd = parent->_d;
	float pid = 1 / (pa * pd - pb * pc);
	float ia = pd * pid, ib = pb * pid, ic = pc * pid, id = pa * pid;
	float dx = _worldX - parent->_worldX, dy = _worldY - parent->_worldY;
	_ax = (dx * ia - dy * ib);
	_ay = (dy * id - dx * ic);

	float ra, rb, rc, rd;
	if (_inherit == Inherit_OnlyTranslation) {
		ra = _a;
		rb = _b;
		rc = _c;
		rd = _d;
	} else {
		switch (_inherit) {
			case Inherit_NoRotationOrReflection: {
				float s = MathUtil::abs(pa * pd - pb * pc) / (pa * pa + pc * pc);
				float sa = pa / _skeleton.getScaleX();
				float sc = pc / _skeleton.getScaleY();
				pb = -sc * s * _skeleton.getScaleX();
				pd = sa * s * _skeleton.getScaleY();
				pid = 1 / (pa * pd - pb * pc);
				ia = pd * pid;
				ib = pb * pid;
				break;
			}
			case Inherit_NoScale:
			case Inherit_NoScaleOrReflection: {
				float r = _rotation * MathUtil::Deg_Rad;
				float cos = MathUtil::cos(r), sin = MathUtil::sin(r);
				pa = (pa * cos + pb * sin) / _skeleton.getScaleX();
				pc = (pc * cos + pd * sin) / _skeleton.getScaleY();
				float s = MathUtil::sqrt(pa * pa + pc * pc);
				if (s > 0.00001) s = 1 / s;
				pa *= s;
				pc *= s;
				s = MathUtil::sqrt(pa * pa + pc * pc);
				if (_inherit == Inherit_NoScale &&
					pid < 0 != (_skeleton.getScaleX() < 0 != _skeleton.getScaleY() < 0))
					s = -s;
				r = MathUtil::Pi / 2 + MathUtil::atan2(pc, pa);
				pb = MathUtil::cos(r) * s;
				pd = MathUtil::sin(r) * s;
				pid = 1 / (pa * pd - pb * pc);
				ia = pd * pid;
				ib = pb * pid;
				ic = pc * pid;
				id = pa * pid;
				break;
			}
			case Inherit_Normal:
			case Inherit_OnlyTranslation:
				break;
		}
		ra = ia * _a - ib * _c;
		rb = ia * _b - ib * _d;
		rc = id * _c - ic * _a;
		rd = id * _d - ic * _b;
	}

	_ashearX = 0;
	_ascaleX = MathUtil::sqrt(ra * ra + rc * rc);
	if (_ascaleX > 0.0001f) {
		float det = ra * rd - rb * rc;
		_ascaleY = det / _ascaleX;
		_ashearY = -MathUtil::atan2Deg(ra * rb + rc * rd, det);
		_arotation = MathUtil::atan2Deg(rc, ra);
	} else {
		_ascaleX = 0;
		_ascaleY = MathUtil::sqrt(rb * rb + rd * rd);
		_ashearY = 0;
		_arotation = 90 - MathUtil::atan2Deg(rd, rb);
	}
}

bool Bone::isActive() {
	return _active;
}

void Bone::setActive(bool inValue) {
	_active = inValue;
}
