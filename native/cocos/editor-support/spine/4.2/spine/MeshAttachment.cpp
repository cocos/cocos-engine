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

#include <spine/MeshAttachment.h>

using namespace spine;

RTTI_IMPL(MeshAttachment, VertexAttachment)

MeshAttachment::MeshAttachment(const String &name) : VertexAttachment(name),
													 _parentMesh(NULL),
													 _path(),
													 _color(1, 1, 1, 1),
													 _hullLength(0),
													 _width(0),
													 _height(0),
													 _region(NULL),
													 _sequence(NULL) {}

MeshAttachment::~MeshAttachment() {
	if (_sequence) delete _sequence;
}

void MeshAttachment::updateRegion() {
	if (_uvs.size() != _regionUVs.size()) {
		_uvs.setSize(_regionUVs.size(), 0);
	}

	if (_region == nullptr) {
		return;
	}

	int i = 0, n = (int) _regionUVs.size();
	float u = _region->u, v = _region->v;
	float width = 0, height = 0;
	switch (_region->degrees) {
		case 90: {
			float textureWidth = _region->height / (_region->u2 - _region->u);
			float textureHeight = _region->width / (_region->v2 - _region->v);
			u -= (_region->originalHeight - _region->offsetY - _region->height) / textureWidth;
			v -= (_region->originalWidth - _region->offsetX - _region->width) / textureHeight;
			width = _region->originalHeight / textureWidth;
			height = _region->originalWidth / textureHeight;
			for (i = 0; i < n; i += 2) {
				_uvs[i] = u + _regionUVs[i + 1] * width;
				_uvs[i + 1] = v + (1 - _regionUVs[i]) * height;
			}
			return;
		}
		case 180: {
			float textureWidth = _region->width / (_region->u2 - _region->u);
			float textureHeight = _region->height / (_region->v2 - _region->v);
			u -= (_region->originalWidth - _region->offsetX - _region->width) / textureWidth;
			v -= _region->offsetY / textureHeight;
			width = _region->originalWidth / textureWidth;
			height = _region->originalHeight / textureHeight;
			for (i = 0; i < n; i += 2) {
				_uvs[i] = u + (1 - _regionUVs[i]) * width;
				_uvs[i + 1] = v + (1 - _regionUVs[i + 1]) * height;
			}
			return;
		}
		case 270: {
			float textureHeight = _region->height / (_region->v2 - _region->v);
			float textureWidth = _region->width / (_region->u2 - _region->u);
			u -= _region->offsetY / textureWidth;
			v -= _region->offsetX / textureHeight;
			width = _region->originalHeight / textureWidth;
			height = _region->originalWidth / textureHeight;
			for (i = 0; i < n; i += 2) {
				_uvs[i] = u + (1 - _regionUVs[i + 1]) * width;
				_uvs[i + 1] = v + _regionUVs[i] * height;
			}
			return;
		}
		default: {
			float textureWidth = _region->width / (_region->u2 - _region->u);
			float textureHeight = _region->height / (_region->v2 - _region->v);
			u -= _region->offsetX / textureWidth;
			v -= (_region->originalHeight - _region->offsetY - _region->height) / textureHeight;
			width = _region->originalWidth / textureWidth;
			height = _region->originalHeight / textureHeight;
			for (i = 0; i < n; i += 2) {
				_uvs[i] = u + _regionUVs[i] * width;
				_uvs[i + 1] = v + _regionUVs[i + 1] * height;
			}
		}
	}
}

int MeshAttachment::getHullLength() {
	return _hullLength;
}

void MeshAttachment::setHullLength(int inValue) {
	_hullLength = inValue;
}

Vector<float> &MeshAttachment::getRegionUVs() {
	return _regionUVs;
}

Vector<float> &MeshAttachment::getUVs() {
	return _uvs;
}

Vector<unsigned short> &MeshAttachment::getTriangles() {
	return _triangles;
}

const String &MeshAttachment::getPath() {
	return _path;
}

void MeshAttachment::setPath(const String &inValue) {
	_path = inValue;
}

TextureRegion *MeshAttachment::getRegion() {
	return _region;
}

void MeshAttachment::setRegion(TextureRegion *region) {
	_region = region;
}

Sequence *MeshAttachment::getSequence() {
	return _sequence;
}

void MeshAttachment::setSequence(Sequence *sequence) {
	_sequence = sequence;
}

MeshAttachment *MeshAttachment::getParentMesh() {
	return _parentMesh;
}

void MeshAttachment::setParentMesh(MeshAttachment *inValue) {
	_parentMesh = inValue;
	if (inValue != NULL) {
		_bones.clearAndAddAll(inValue->_bones);
		_vertices.clearAndAddAll(inValue->_vertices);
		_worldVerticesLength = inValue->_worldVerticesLength;
		_regionUVs.clearAndAddAll(inValue->_regionUVs);
		_triangles.clearAndAddAll(inValue->_triangles);
		_hullLength = inValue->_hullLength;
		_edges.clearAndAddAll(inValue->_edges);
		_width = inValue->_width;
		_height = inValue->_height;
	}
}

Vector<unsigned short> &MeshAttachment::getEdges() {
	return _edges;
}

float MeshAttachment::getWidth() {
	return _width;
}

void MeshAttachment::setWidth(float inValue) {
	_width = inValue;
}

float MeshAttachment::getHeight() {
	return _height;
}

void MeshAttachment::setHeight(float inValue) {
	_height = inValue;
}

spine::Color &MeshAttachment::getColor() {
	return _color;
}

Attachment *MeshAttachment::copy() {
	if (_parentMesh) return newLinkedMesh();

	MeshAttachment *copy = new (__FILE__, __LINE__) MeshAttachment(getName());
	copy->setRegion(_region);
	copy->setSequence(_sequence != NULL ? _sequence->copy() : NULL);
	copy->_path = _path;
	copy->_color.set(_color);

	copyTo(copy);
	copy->_regionUVs.clearAndAddAll(_regionUVs);
	copy->_uvs.clearAndAddAll(_uvs);
	copy->_triangles.clearAndAddAll(_triangles);
	copy->_hullLength = _hullLength;

	// Nonessential.
	copy->_edges.clearAndAddAll(copy->_edges);
	copy->_width = _width;
	copy->_height = _height;
	return copy;
}

MeshAttachment *MeshAttachment::newLinkedMesh() {
	MeshAttachment *copy = new (__FILE__, __LINE__) MeshAttachment(getName());
	copy->setRegion(_region);
	copy->_path = _path;
	copy->_color.set(_color);
	copy->_timelineAttachment = this->_timelineAttachment;
	copy->setParentMesh(_parentMesh ? _parentMesh : this);
	if (copy->_region) copy->updateRegion();
	return copy;
}

void MeshAttachment::computeWorldVertices(Slot &slot, size_t start, size_t count, float *worldVertices, size_t offset,
										  size_t stride) {
	if (_sequence) _sequence->apply(&slot, this);
	VertexAttachment::computeWorldVertices(slot, start, count, worldVertices, offset, stride);
}
