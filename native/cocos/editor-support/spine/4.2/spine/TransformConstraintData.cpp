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

#include <spine/TransformConstraintData.h>

#include <spine/BoneData.h>

#include <assert.h>

using namespace spine;

RTTI_IMPL(TransformConstraintData, ConstraintData)

TransformConstraintData::TransformConstraintData(const String &name) : ConstraintData(name),
																	   _target(NULL),
																	   _mixRotate(0),
																	   _mixX(0),
																	   _mixY(0),
																	   _mixScaleX(0),
																	   _mixScaleY(0),
																	   _mixShearY(0),
																	   _offsetRotation(0),
																	   _offsetX(0),
																	   _offsetY(0),
																	   _offsetScaleX(0),
																	   _offsetScaleY(0),
																	   _offsetShearY(0),
																	   _relative(false),
																	   _local(false) {
}

Vector<BoneData *> &TransformConstraintData::getBones() {
	return _bones;
}

BoneData *TransformConstraintData::getTarget() {
	return _target;
}

float TransformConstraintData::getMixRotate() {
	return _mixRotate;
}

float TransformConstraintData::getMixX() {
	return _mixX;
}

float TransformConstraintData::getMixY() {
	return _mixY;
}

float TransformConstraintData::getMixScaleX() {
	return _mixScaleX;
}

float TransformConstraintData::getMixScaleY() {
	return _mixScaleY;
}

float TransformConstraintData::getMixShearY() {
	return _mixShearY;
}

float TransformConstraintData::getOffsetRotation() {
	return _offsetRotation;
}

float TransformConstraintData::getOffsetX() {
	return _offsetX;
}

float TransformConstraintData::getOffsetY() {
	return _offsetY;
}

float TransformConstraintData::getOffsetScaleX() {
	return _offsetScaleX;
}

float TransformConstraintData::getOffsetScaleY() {
	return _offsetScaleY;
}

float TransformConstraintData::getOffsetShearY() {
	return _offsetShearY;
}

bool TransformConstraintData::isRelative() {
	return _relative;
}

bool TransformConstraintData::isLocal() {
	return _local;
}

void TransformConstraintData::setTarget(BoneData *target) {
	_target = target;
}

void TransformConstraintData::setMixRotate(float mixRotate) {
	_mixRotate = mixRotate;
}

void TransformConstraintData::setMixX(float mixX) {
	_mixX = mixX;
}

void TransformConstraintData::setMixY(float mixY) {
	_mixY = mixY;
}

void TransformConstraintData::setMixScaleX(float mixScaleX) {
	_mixScaleX = mixScaleX;
}

void TransformConstraintData::setMixScaleY(float mixScaleY) {
	_mixScaleY = mixScaleY;
}

void TransformConstraintData::setMixShearY(float mixShearY) {
	_mixShearY = mixShearY;
}

void TransformConstraintData::setOffsetRotation(float offsetRotation) {
	_offsetRotation = offsetRotation;
}

void TransformConstraintData::setOffsetX(float offsetX) {
	_offsetX = offsetX;
}

void TransformConstraintData::setOffsetY(float offsetY) {
	_offsetY = offsetY;
}

void TransformConstraintData::setOffsetScaleX(float offsetScaleX) {
	_offsetScaleX = offsetScaleX;
}

void TransformConstraintData::setOffsetScaleY(float offsetScaleY) {
	_offsetScaleY = offsetScaleY;
}

void TransformConstraintData::setOffsetShearY(float offsetShearY) {
	_offsetShearY = offsetShearY;
}

void TransformConstraintData::setRelative(bool isRelative) {
	_relative = isRelative;
}

void TransformConstraintData::setLocal(bool isLocal) {
	_local = isLocal;
}
