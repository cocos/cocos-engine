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

#include <spine/PhysicsConstraint.h>
#include <spine/PhysicsConstraintData.h>

#include <spine/Bone.h>
#include <spine/Skeleton.h>
#include <spine/SkeletonData.h>
#include <spine/BoneData.h>

using namespace spine;

RTTI_IMPL(PhysicsConstraint, Updatable)

PhysicsConstraint::PhysicsConstraint(PhysicsConstraintData &data, Skeleton &skeleton)
	: _data(data), _skeleton(skeleton) {
	_bone = skeleton.getBones()[data.getBone()->getIndex()];
	_inertia = data.getInertia();
	_strength = data.getStrength();
	_damping = data.getDamping();
	_massInverse = data.getMassInverse();
	_wind = data.getWind();
	_gravity = data.getGravity();
	_mix = data.getMix();

	_reset = true;
	_ux = 0;
	_uy = 0;
	_cx = 0;
	_cy = 0;
	_tx = 0;
	_ty = 0;
	_xOffset = 0;
	_xVelocity = 0;
	_yOffset = 0;
	_yVelocity = 0;
	_rotateOffset = 0;
	_rotateVelocity = 0;
	_scaleOffset = 0;
	_scaleVelocity = 0;
	_active = false;
	_remaining = 0;
	_lastTime = 0;
}

PhysicsConstraintData &PhysicsConstraint::getData() {
	return _data;
}

void PhysicsConstraint::setBone(Bone *bone) {
	_bone = bone;
}

Bone *PhysicsConstraint::getBone() {
	return _bone;
}

void PhysicsConstraint::setInertia(float value) {
	_inertia = value;
}

float PhysicsConstraint::getInertia() {
	return _inertia;
}

void PhysicsConstraint::setStrength(float value) {
	_strength = value;
}

float PhysicsConstraint::getStrength() {
	return _strength;
}

void PhysicsConstraint::setDamping(float value) {
	_damping = value;
}

float PhysicsConstraint::getDamping() {
	return _damping;
}

void PhysicsConstraint::setMassInverse(float value) {
	_massInverse = value;
}

float PhysicsConstraint::getMassInverse() {
	return _massInverse;
}

void PhysicsConstraint::setWind(float value) {
	_wind = value;
}

float PhysicsConstraint::getWind() {
	return _wind;
}

void PhysicsConstraint::setGravity(float value) {
	_gravity = value;
}

float PhysicsConstraint::getGravity() {
	return _gravity;
}

void PhysicsConstraint::setMix(float value) {
	_mix = value;
}

float PhysicsConstraint::getMix() {
	return _mix;
}

void PhysicsConstraint::setReset(bool value) {
	_reset = value;
}

bool PhysicsConstraint::getReset() {
	return _reset;
}

void PhysicsConstraint::setUx(float value) {
	_ux = value;
}

float PhysicsConstraint::getUx() {
	return _ux;
}

void PhysicsConstraint::setUy(float value) {
	_uy = value;
}

float PhysicsConstraint::getUy() {
	return _uy;
}

void PhysicsConstraint::setCx(float value) {
	_cx = value;
}

float PhysicsConstraint::getCx() {
	return _cx;
}

void PhysicsConstraint::setCy(float value) {
	_cy = value;
}

float PhysicsConstraint::getCy() {
	return _cy;
}

void PhysicsConstraint::setTx(float value) {
	_tx = value;
}

float PhysicsConstraint::getTx() {
	return _tx;
}

void PhysicsConstraint::setTy(float value) {
	_ty = value;
}

float PhysicsConstraint::getTy() {
	return _ty;
}

void PhysicsConstraint::setXOffset(float value) {
	_xOffset = value;
}

float PhysicsConstraint::getXOffset() {
	return _xOffset;
}

void PhysicsConstraint::setXVelocity(float value) {
	_xVelocity = value;
}

float PhysicsConstraint::getXVelocity() {
	return _xVelocity;
}

void PhysicsConstraint::setYOffset(float value) {
	_yOffset = value;
}

float PhysicsConstraint::getYOffset() {
	return _yOffset;
}

void PhysicsConstraint::setYVelocity(float value) {
	_yVelocity = value;
}

float PhysicsConstraint::getYVelocity() {
	return _yVelocity;
}

void PhysicsConstraint::setRotateOffset(float value) {
	_rotateOffset = value;
}

float PhysicsConstraint::getRotateOffset() {
	return _rotateOffset;
}

void PhysicsConstraint::setRotateVelocity(float value) {
	_rotateVelocity = value;
}

float PhysicsConstraint::getRotateVelocity() {
	return _rotateVelocity;
}

void PhysicsConstraint::setScaleOffset(float value) {
	_scaleOffset = value;
}

float PhysicsConstraint::getScaleOffset() {
	return _scaleOffset;
}

void PhysicsConstraint::setScaleVelocity(float value) {
	_scaleVelocity = value;
}

float PhysicsConstraint::getScaleVelocity() {
	return _scaleVelocity;
}

void PhysicsConstraint::setActive(bool value) {
	_active = value;
}

bool PhysicsConstraint::isActive() {
	return _active;
}

void PhysicsConstraint::setRemaining(float value) {
	_remaining = value;
}

float PhysicsConstraint::getRemaining() {
	return _remaining;
}

void PhysicsConstraint::setLastTime(float value) {
	_lastTime = value;
}

float PhysicsConstraint::getLastTime() {
	return _lastTime;
}

void PhysicsConstraint::reset() {
	_remaining = 0;
	_lastTime = _skeleton.getTime();
	_reset = true;
	_xOffset = 0;
	_xVelocity = 0;
	_yOffset = 0;
	_yVelocity = 0;
	_rotateOffset = 0;
	_rotateVelocity = 0;
	_scaleOffset = 0;
	_scaleVelocity = 0;
}

void PhysicsConstraint::setToSetupPose() {
	_inertia = _data.getInertia();
	_strength = _data.getStrength();
	_damping = _data.getDamping();
	_massInverse = _data.getMassInverse();
	_wind = _data.getWind();
	_gravity = _data.getGravity();
	_mix = _data.getMix();
}
void PhysicsConstraint::update(Physics physics) {
	float mix = _mix;
	if (mix == 0) return;

	bool x = _data._x > 0;
	bool y = _data._y > 0;
	bool rotateOrShearX = _data._rotate > 0 || _data._shearX > 0;
	bool scaleX = _data._scaleX > 0;

	Bone *bone = _bone;
	float l = bone->_data.getLength();

	switch (physics) {
		case Physics::Physics_None:
			return;
		case Physics::Physics_Reset:
			reset();
			// Fall through.
		case Physics::Physics_Update: {
			float delta = MathUtil::max(_skeleton.getTime() - _lastTime, 0.0f);
			_remaining += delta;
			_lastTime = _skeleton.getTime();

			float bx = bone->_worldX, by = bone->_worldY;
			if (_reset) {
				_reset = false;
				_ux = bx;
				_uy = by;
			} else {
				float a = _remaining, i = _inertia, t = _data._step, f = _skeleton.getData()->getReferenceScale();
				float qx = _data._limit * delta, qy = qx * MathUtil::abs(_skeleton.getScaleX());
				qx *= MathUtil::abs(_skeleton.getScaleY());
				if (x || y) {
					if (x) {
						float u = (_ux - bx) * i;
						_xOffset += u > qx ? qx : u < -qx ? -qx
														  : u;
						_ux = bx;
					}
					if (y) {
						float u = (_uy - by) * i;
						_yOffset += u > qy ? qy : u < -qy ? -qy
														  : u;
						_uy = by;
					}
					if (a >= t) {
						float d = MathUtil::pow(_damping, 60 * t);
						float m = _massInverse * t, e = _strength, w = _wind * f * _skeleton.getScaleX(), g = _gravity * f * _skeleton.getScaleY();
						do {
							if (x) {
								_xVelocity += (w - _xOffset * e) * m;
								_xOffset += _xVelocity * t;
								_xVelocity *= d;
							}
							if (y) {
								_yVelocity -= (g + _yOffset * e) * m;
								_yOffset += _yVelocity * t;
								_yVelocity *= d;
							}
							a -= t;
						} while (a >= t);
					}
					if (x) bone->_worldX += _xOffset * mix * _data._x;
					if (y) bone->_worldY += _yOffset * mix * _data._y;
				}

				if (rotateOrShearX || scaleX) {
					float ca = MathUtil::atan2(bone->_c, bone->_a), c, s, mr = 0;
					float dx = _cx - bone->_worldX, dy = _cy - bone->_worldY;
					if (dx > qx)
						dx = qx;
					else if (dx < -qx)//
						dx = -qx;
					if (dy > qy)
						dy = qy;
					else if (dy < -qy)//
						dy = -qy;
					if (rotateOrShearX) {
						mr = (_data._rotate + _data._shearX) * mix;
						float r = MathUtil::atan2(dy + _ty, dx + _tx) - ca - _rotateOffset * mr;
						_rotateOffset += (r - MathUtil::ceil(r * MathUtil::InvPi_2 - 0.5f) * MathUtil::Pi_2) * i;
						r = _rotateOffset * mr + ca;
						c = MathUtil::cos(r);
						s = MathUtil::sin(r);
						if (scaleX) {
							r = l * bone->getWorldScaleX();
							if (r > 0) _scaleOffset += (dx * c + dy * s) * i / r;
						}
					} else {
						c = MathUtil::cos(ca);
						s = MathUtil::sin(ca);
						float r = l * bone->getWorldScaleX();
						if (r > 0) _scaleOffset += (dx * c + dy * s) * i / r;
					}
					a = _remaining;
					if (a >= t) {
						float m = _massInverse * t, e = _strength, w = _wind, g = _gravity * (Bone::yDown ? -1 : 1), h = l / f;
						float d = MathUtil::pow(_damping, 60 * t);
						while (true) {
							a -= t;
							if (scaleX) {
								_scaleVelocity += (w * c - g * s - _scaleOffset * e) * m;
								_scaleOffset += _scaleVelocity * t;
								_scaleVelocity *= d;
							}
							if (rotateOrShearX) {
								_rotateVelocity -= ((w * s + g * c) * h + _rotateOffset * e) * m;
								_rotateOffset += _rotateVelocity * t;
								_rotateVelocity *= d;
								if (a < t) break;
								float r = _rotateOffset * mr + ca;
								c = MathUtil::cos(r);
								s = MathUtil::sin(r);
							} else if (a < t)//
								break;
						}
					}
				}
				_remaining = a;
			}

			_cx = bone->_worldX;
			_cy = bone->_worldY;
			break;
		}
		case Physics::Physics_Pose: {
			if (x) bone->_worldX += _xOffset * mix * _data._x;
			if (y) bone->_worldY += _yOffset * mix * _data._y;
			break;
		}
	}

	if (rotateOrShearX) {
		float o = _rotateOffset * mix, s = 0, c = 0, a = 0;
		if (_data._shearX > 0) {
			float r = 0;
			if (_data._rotate > 0) {
				r = o * _data._rotate;
				s = MathUtil::sin(r);
				c = MathUtil::cos(r);
				a = bone->_b;
				bone->_b = c * a - s * bone->_d;
				bone->_d = s * a + c * bone->_d;
			}
			r += o * _data._shearX;
			s = MathUtil::sin(r);
			c = MathUtil::cos(r);
			a = bone->_a;
			bone->_a = c * a - s * bone->_c;
			bone->_c = s * a + c * bone->_c;
		} else {
			o *= _data._rotate;
			s = MathUtil::sin(o);
			c = MathUtil::cos(o);
			a = bone->_a;
			bone->_a = c * a - s * bone->_c;
			bone->_c = s * a + c * bone->_c;
			a = bone->_b;
			bone->_b = c * a - s * bone->_d;
			bone->_d = s * a + c * bone->_d;
		}
	}
	if (scaleX) {
		float s = 1 + _scaleOffset * mix * _data._scaleX;
		bone->_a *= s;
		bone->_c *= s;
	}
	if (physics != Physics::Physics_Pose) {
		_tx = l * bone->_a;
		_ty = l * bone->_c;
	}
	bone->updateAppliedTransform();
}

void PhysicsConstraint::rotate(float x, float y, float degrees) {
	float r = degrees * MathUtil::Deg_Rad, cos = MathUtil::cos(r), sin = MathUtil::sin(r);
	float dx = _cx - x, dy = _cy - y;
	translate(dx * cos - dy * sin - dx, dx * sin + dy * cos - dy);
}

void PhysicsConstraint::translate(float x, float y) {
	_ux -= x;
	_uy -= y;
	_cx -= x;
	_cy -= y;
}
