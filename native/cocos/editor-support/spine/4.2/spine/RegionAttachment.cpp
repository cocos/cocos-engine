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

#include <spine/RegionAttachment.h>

#include <spine/Bone.h>
#include <spine/Slot.h>

#include <assert.h>

using namespace spine;

RTTI_IMPL(RegionAttachment, Attachment)

const int RegionAttachment::BLX = 0;
const int RegionAttachment::BLY = 1;
const int RegionAttachment::ULX = 2;
const int RegionAttachment::ULY = 3;
const int RegionAttachment::URX = 4;
const int RegionAttachment::URY = 5;
const int RegionAttachment::BRX = 6;
const int RegionAttachment::BRY = 7;

RegionAttachment::RegionAttachment(const String &name) : Attachment(name),
														 _x(0),
														 _y(0),
														 _rotation(0),
														 _scaleX(1),
														 _scaleY(1),
														 _width(0),
														 _height(0),
														 _path(),
														 _color(1, 1, 1, 1),
														 _region(NULL),
														 _sequence(NULL) {
	_vertexOffset.setSize(NUM_UVS, 0);
	_uvs.setSize(NUM_UVS, 0);
}

RegionAttachment::~RegionAttachment() {
	if (_sequence) delete _sequence;
}

void RegionAttachment::updateRegion() {
	if (_region == NULL) {
		_uvs[BLX] = 0;
		_uvs[BLY] = 0;
		_uvs[ULX] = 0;
		_uvs[ULY] = 1;
		_uvs[URX] = 1;
		_uvs[URY] = 1;
		_uvs[BRX] = 1;
		_uvs[BRY] = 0;
		return;
	}

	float regionScaleX = _width / _region->originalWidth * _scaleX;
	float regionScaleY = _height / _region->originalHeight * _scaleY;
	float localX = -_width / 2 * _scaleX + _region->offsetX * regionScaleX;
	float localY = -_height / 2 * _scaleY + _region->offsetY * regionScaleY;
	float localX2 = localX + _region->width * regionScaleX;
	float localY2 = localY + _region->height * regionScaleY;
	float cos = MathUtil::cosDeg(_rotation);
	float sin = MathUtil::sinDeg(_rotation);
	float localXCos = localX * cos + _x;
	float localXSin = localX * sin;
	float localYCos = localY * cos + _y;
	float localYSin = localY * sin;
	float localX2Cos = localX2 * cos + _x;
	float localX2Sin = localX2 * sin;
	float localY2Cos = localY2 * cos + _y;
	float localY2Sin = localY2 * sin;

	_vertexOffset[BLX] = localXCos - localYSin;
	_vertexOffset[BLY] = localYCos + localXSin;
	_vertexOffset[ULX] = localXCos - localY2Sin;
	_vertexOffset[ULY] = localY2Cos + localXSin;
	_vertexOffset[URX] = localX2Cos - localY2Sin;
	_vertexOffset[URY] = localY2Cos + localX2Sin;
	_vertexOffset[BRX] = localX2Cos - localYSin;
	_vertexOffset[BRY] = localYCos + localX2Sin;

	if (_region->degrees == 90) {
		_uvs[URX] = _region->u;
		_uvs[URY] = _region->v2;
		_uvs[BRX] = _region->u;
		_uvs[BRY] = _region->v;
		_uvs[BLX] = _region->u2;
		_uvs[BLY] = _region->v;
		_uvs[ULX] = _region->u2;
		_uvs[ULY] = _region->v2;
	} else {
		_uvs[ULX] = _region->u;
		_uvs[ULY] = _region->v2;
		_uvs[URX] = _region->u;
		_uvs[URY] = _region->v;
		_uvs[BRX] = _region->u2;
		_uvs[BRY] = _region->v;
		_uvs[BLX] = _region->u2;
		_uvs[BLY] = _region->v2;
	}
}

void RegionAttachment::computeWorldVertices(Slot &slot, Vector<float> &worldVertices, size_t offset, size_t stride) {
	assert(worldVertices.size() >= (offset + 8));
	computeWorldVertices(slot, worldVertices.buffer(), offset, stride);
}

void RegionAttachment::computeWorldVertices(Slot &slot, float *worldVertices, size_t offset, size_t stride) {
	if (_sequence) _sequence->apply(&slot, this);

	Bone &bone = slot.getBone();
	float x = bone.getWorldX(), y = bone.getWorldY();
	float a = bone.getA(), b = bone.getB(), c = bone.getC(), d = bone.getD();
	float offsetX, offsetY;

	offsetX = _vertexOffset[BRX];
	offsetY = _vertexOffset[BRY];
	worldVertices[offset] = offsetX * a + offsetY * b + x;// br
	worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
	offset += stride;

	offsetX = _vertexOffset[BLX];
	offsetY = _vertexOffset[BLY];
	worldVertices[offset] = offsetX * a + offsetY * b + x;// bl
	worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
	offset += stride;

	offsetX = _vertexOffset[ULX];
	offsetY = _vertexOffset[ULY];
	worldVertices[offset] = offsetX * a + offsetY * b + x;// ul
	worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
	offset += stride;

	offsetX = _vertexOffset[URX];
	offsetY = _vertexOffset[URY];
	worldVertices[offset] = offsetX * a + offsetY * b + x;// ur
	worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
}

float RegionAttachment::getX() {
	return _x;
}

void RegionAttachment::setX(float inValue) {
	_x = inValue;
}

float RegionAttachment::getY() {
	return _y;
}

void RegionAttachment::setY(float inValue) {
	_y = inValue;
}

float RegionAttachment::getRotation() {
	return _rotation;
}

void RegionAttachment::setRotation(float inValue) {
	_rotation = inValue;
}

float RegionAttachment::getScaleX() {
	return _scaleX;
}

void RegionAttachment::setScaleX(float inValue) {
	_scaleX = inValue;
}

float RegionAttachment::getScaleY() {
	return _scaleY;
}

void RegionAttachment::setScaleY(float inValue) {
	_scaleY = inValue;
}

float RegionAttachment::getWidth() {
	return _width;
}

void RegionAttachment::setWidth(float inValue) {
	_width = inValue;
}

float RegionAttachment::getHeight() {
	return _height;
}

void RegionAttachment::setHeight(float inValue) {
	_height = inValue;
}

const String &RegionAttachment::getPath() {
	return _path;
}

void RegionAttachment::setPath(const String &inValue) {
	_path = inValue;
}

TextureRegion *RegionAttachment::getRegion() {
	return _region;
}

void RegionAttachment::setRegion(TextureRegion *region) {
	_region = region;
}

Sequence *RegionAttachment::getSequence() {
	return _sequence;
}

void RegionAttachment::setSequence(Sequence *sequence) {
	_sequence = sequence;
}

Vector<float> &RegionAttachment::getOffset() {
	return _vertexOffset;
}

Vector<float> &RegionAttachment::getUVs() {
	return _uvs;
}

spine::Color &RegionAttachment::getColor() {
	return _color;
}

Attachment *RegionAttachment::copy() {
	RegionAttachment *copy = new (__FILE__, __LINE__) RegionAttachment(getName());
	copy->_region = _region;
	copy->_path = _path;
	copy->_x = _x;
	copy->_y = _y;
	copy->_scaleX = _scaleX;
	copy->_scaleY = _scaleY;
	copy->_rotation = _rotation;
	copy->_width = _width;
	copy->_height = _height;
	copy->_uvs.clearAndAddAll(_uvs);
	copy->_vertexOffset.clearAndAddAll(_vertexOffset);
	copy->_color.set(_color);
	copy->_sequence = _sequence != NULL ? _sequence->copy() : NULL;
	return copy;
}
