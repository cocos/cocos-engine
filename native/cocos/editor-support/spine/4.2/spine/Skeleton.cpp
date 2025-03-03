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

#include <spine/Skeleton.h>

#include <spine/Attachment.h>
#include <spine/Bone.h>
#include <spine/IkConstraint.h>
#include <spine/PathConstraint.h>
#include <spine/PhysicsConstraint.h>
#include <spine/SkeletonData.h>
#include <spine/Skin.h>
#include <spine/Slot.h>
#include <spine/TransformConstraint.h>

#include <spine/BoneData.h>
#include <spine/IkConstraintData.h>
#include <spine/ClippingAttachment.h>
#include <spine/MeshAttachment.h>
#include <spine/PathAttachment.h>
#include <spine/PathConstraintData.h>
#include <spine/PhysicsConstraintData.h>
#include <spine/RegionAttachment.h>
#include <spine/SlotData.h>
#include <spine/TransformConstraintData.h>
#include <spine/SkeletonClipping.h>

#include <spine/ContainerUtil.h>

#include <float.h>

using namespace spine;

Skeleton::Skeleton(SkeletonData *skeletonData)
	: _data(skeletonData), _skin(NULL), _color(1, 1, 1, 1), _scaleX(1),
	  _scaleY(1), _x(0), _y(0), _time(0) {
	_bones.ensureCapacity(_data->getBones().size());
	for (size_t i = 0; i < _data->getBones().size(); ++i) {
		BoneData *data = _data->getBones()[i];

		Bone *bone;
		if (data->getParent() == NULL) {
			bone = new (__FILE__, __LINE__) Bone(*data, *this, NULL);
		} else {
			Bone *parent = _bones[data->getParent()->getIndex()];
			bone = new (__FILE__, __LINE__) Bone(*data, *this, parent);
			parent->getChildren().add(bone);
		}

		_bones.add(bone);
	}

	_slots.ensureCapacity(_data->getSlots().size());
	_drawOrder.ensureCapacity(_data->getSlots().size());
	for (size_t i = 0; i < _data->getSlots().size(); ++i) {
		SlotData *data = _data->getSlots()[i];

		Bone *bone = _bones[data->getBoneData().getIndex()];
		Slot *slot = new (__FILE__, __LINE__) Slot(*data, *bone);

		_slots.add(slot);
		_drawOrder.add(slot);
	}

	_ikConstraints.ensureCapacity(_data->getIkConstraints().size());
	for (size_t i = 0; i < _data->getIkConstraints().size(); ++i) {
		IkConstraintData *data = _data->getIkConstraints()[i];

		IkConstraint *constraint =
				new (__FILE__, __LINE__) IkConstraint(*data, *this);

		_ikConstraints.add(constraint);
	}

	_transformConstraints.ensureCapacity(_data->getTransformConstraints().size());
	for (size_t i = 0; i < _data->getTransformConstraints().size(); ++i) {
		TransformConstraintData *data = _data->getTransformConstraints()[i];

		TransformConstraint *constraint =
				new (__FILE__, __LINE__) TransformConstraint(*data, *this);

		_transformConstraints.add(constraint);
	}

	_pathConstraints.ensureCapacity(_data->getPathConstraints().size());
	for (size_t i = 0; i < _data->getPathConstraints().size(); ++i) {
		PathConstraintData *data = _data->getPathConstraints()[i];

		PathConstraint *constraint =
				new (__FILE__, __LINE__) PathConstraint(*data, *this);

		_pathConstraints.add(constraint);
	}

	_physicsConstraints.ensureCapacity(_data->getPhysicsConstraints().size());
	for (size_t i = 0; i < _data->getPhysicsConstraints().size(); ++i) {
		PhysicsConstraintData *data = _data->getPhysicsConstraints()[i];

		PhysicsConstraint *constraint =
				new (__FILE__, __LINE__) PhysicsConstraint(*data, *this);

		_physicsConstraints.add(constraint);
	}

	updateCache();
}

Skeleton::~Skeleton() {
	ContainerUtil::cleanUpVectorOfPointers(_bones);
	ContainerUtil::cleanUpVectorOfPointers(_slots);
	ContainerUtil::cleanUpVectorOfPointers(_ikConstraints);
	ContainerUtil::cleanUpVectorOfPointers(_transformConstraints);
	ContainerUtil::cleanUpVectorOfPointers(_pathConstraints);
	ContainerUtil::cleanUpVectorOfPointers(_physicsConstraints);
}

void Skeleton::updateCache() {
	_updateCache.clear();

	for (size_t i = 0, n = _bones.size(); i < n; ++i) {
		Bone *bone = _bones[i];
		bone->_sorted = bone->_data.isSkinRequired();
		bone->_active = !bone->_sorted;
	}

	if (_skin) {
		Vector<BoneData *> &skinBones = _skin->getBones();
		for (size_t i = 0, n = skinBones.size(); i < n; i++) {
			Bone *bone = _bones[skinBones[i]->getIndex()];
			do {
				bone->_sorted = false;
				bone->_active = true;
				bone = bone->_parent;
			} while (bone);
		}
	}

	size_t ikCount = _ikConstraints.size();
	size_t transformCount = _transformConstraints.size();
	size_t pathCount = _pathConstraints.size();
	size_t physicsCount = _physicsConstraints.size();
	size_t constraintCount = ikCount + transformCount + pathCount + physicsCount;

	size_t i = 0;
continue_outer:
	for (; i < constraintCount; ++i) {
		for (size_t ii = 0; ii < ikCount; ++ii) {
			IkConstraint *constraint = _ikConstraints[ii];
			if (constraint->getData().getOrder() == i) {
				sortIkConstraint(constraint);
				i++;
				goto continue_outer;
			}
		}

		for (size_t ii = 0; ii < transformCount; ++ii) {
			TransformConstraint *constraint = _transformConstraints[ii];
			if (constraint->getData().getOrder() == i) {
				sortTransformConstraint(constraint);
				i++;
				goto continue_outer;
			}
		}

		for (size_t ii = 0; ii < pathCount; ++ii) {
			PathConstraint *constraint = _pathConstraints[ii];
			if (constraint->getData().getOrder() == i) {
				sortPathConstraint(constraint);
				i++;
				goto continue_outer;
			}
		}

		for (size_t ii = 0; ii < physicsCount; ++ii) {
			PhysicsConstraint *constraint = _physicsConstraints[ii];
			if (constraint->getData().getOrder() == i) {
				sortPhysicsConstraint(constraint);
				i++;
				goto continue_outer;
			}
		}
	}

	size_t n = _bones.size();
	for (i = 0; i < n; ++i) {
		sortBone(_bones[i]);
	}
}

void Skeleton::printUpdateCache() {
	for (size_t i = 0; i < _updateCache.size(); i++) {
		Updatable *updatable = _updateCache[i];
		if (updatable->getRTTI().isExactly(Bone::rtti)) {
			printf("bone %s\n", ((Bone *) updatable)->getData().getName().buffer());
		} else if (updatable->getRTTI().isExactly(TransformConstraint::rtti)) {
			printf("transform constraint %s\n",
				   ((TransformConstraint *) updatable)->getData().getName().buffer());
		} else if (updatable->getRTTI().isExactly(IkConstraint::rtti)) {
			printf("ik constraint %s\n",
				   ((IkConstraint *) updatable)->getData().getName().buffer());
		} else if (updatable->getRTTI().isExactly(PathConstraint::rtti)) {
			printf("path constraint %s\n",
				   ((PathConstraint *) updatable)->getData().getName().buffer());
		} else if (updatable->getRTTI().isExactly(PhysicsConstraint::rtti)) {
			printf("physics constraint %s\n",
				   ((PhysicsConstraint *) updatable)->getData().getName().buffer());
		}
	}
}

void Skeleton::updateWorldTransform(Physics physics) {
	for (size_t i = 0, n = _bones.size(); i < n; i++) {
		Bone *bone = _bones[i];
		bone->_ax = bone->_x;
		bone->_ay = bone->_y;
		bone->_arotation = bone->_rotation;
		bone->_ascaleX = bone->_scaleX;
		bone->_ascaleY = bone->_scaleY;
		bone->_ashearX = bone->_shearX;
		bone->_ashearY = bone->_shearY;
	}

	for (size_t i = 0, n = _updateCache.size(); i < n; ++i) {
		Updatable *updatable = _updateCache[i];
		updatable->update(physics);
	}
}

void Skeleton::updateWorldTransform(Physics physics, Bone *parent) {
	// Apply the parent bone transform to the root bone. The root bone always
	// inherits scale, rotation and reflection.
	Bone *rootBone = getRootBone();
	float pa = parent->_a, pb = parent->_b, pc = parent->_c, pd = parent->_d;
	rootBone->_worldX = pa * _x + pb * _y + parent->_worldX;
	rootBone->_worldY = pc * _x + pd * _y + parent->_worldY;

	float rx = (rootBone->_rotation + rootBone->_shearX) * MathUtil::Deg_Rad;
	float ry = (rootBone->_rotation + 90 + rootBone->_shearY) * MathUtil::Deg_Rad;
	float la = MathUtil::cos(rx) * rootBone->_scaleX;
	float lb = MathUtil::cos(ry) * rootBone->_scaleY;
	float lc = MathUtil::sin(rx) * rootBone->_scaleX;
	float ld = MathUtil::sin(ry) * rootBone->_scaleY;
	rootBone->_a = (pa * la + pb * lc) * _scaleX;
	rootBone->_b = (pa * lb + pb * ld) * _scaleX;
	rootBone->_c = (pc * la + pd * lc) * _scaleY;
	rootBone->_d = (pc * lb + pd * ld) * _scaleY;

	// Update everything except root bone.
	Bone *rb = getRootBone();
	for (size_t i = 0, n = _updateCache.size(); i < n; i++) {
		Updatable *updatable = _updateCache[i];
		if (updatable != rb)
			updatable->update(physics);
	}
}

void Skeleton::setToSetupPose() {
	setBonesToSetupPose();
	setSlotsToSetupPose();
}

void Skeleton::setBonesToSetupPose() {
	for (size_t i = 0, n = _bones.size(); i < n; ++i) {
		_bones[i]->setToSetupPose();
	}

	for (size_t i = 0, n = _ikConstraints.size(); i < n; ++i) {
		_ikConstraints[i]->setToSetupPose();
	}

	for (size_t i = 0, n = _transformConstraints.size(); i < n; ++i) {
		_transformConstraints[i]->setToSetupPose();
	}

	for (size_t i = 0, n = _pathConstraints.size(); i < n; ++i) {
		_pathConstraints[i]->setToSetupPose();
	}

	for (size_t i = 0, n = _physicsConstraints.size(); i < n; ++i) {
		_physicsConstraints[i]->setToSetupPose();
	}
}

void Skeleton::setSlotsToSetupPose() {
	_drawOrder.clear();
	for (size_t i = 0, n = _slots.size(); i < n; ++i) {
		_drawOrder.add(_slots[i]);
	}

	for (size_t i = 0, n = _slots.size(); i < n; ++i) {
		_slots[i]->setToSetupPose();
	}
}

Bone *Skeleton::findBone(const String &boneName) {
	return ContainerUtil::findWithDataName(_bones, boneName);
}

Slot *Skeleton::findSlot(const String &slotName) {
	return ContainerUtil::findWithDataName(_slots, slotName);
}

void Skeleton::setSkin(const String &skinName) {
	Skin *foundSkin = skinName.isEmpty() ? NULL : _data->findSkin(skinName);
	setSkin(foundSkin);
}

void Skeleton::setSkin(Skin *newSkin) {
	if (_skin == newSkin)
		return;
	if (newSkin != NULL) {
		if (_skin != NULL) {
			Skeleton &thisRef = *this;
			newSkin->attachAll(thisRef, *_skin);
		} else {
			for (size_t i = 0, n = _slots.size(); i < n; ++i) {
				Slot *slotP = _slots[i];
				Slot &slot = *slotP;
				const String &name = slot._data.getAttachmentName();
				if (name.length() > 0) {
					Attachment *attachment = newSkin->getAttachment(i, name);
					if (attachment != NULL) {
						slot.setAttachment(attachment);
					}
				}
			}
		}
	}

	_skin = newSkin;
	updateCache();
}

Attachment *Skeleton::getAttachment(const String &slotName,
									const String &attachmentName) {
	return getAttachment(_data->findSlot(slotName)->getIndex(), attachmentName);
}

Attachment *Skeleton::getAttachment(int slotIndex,
									const String &attachmentName) {
	if (attachmentName.isEmpty())
		return NULL;

	if (_skin != NULL) {
		Attachment *attachment = _skin->getAttachment(slotIndex, attachmentName);
		if (attachment != NULL) {
			return attachment;
		}
	}

	return _data->getDefaultSkin() != NULL
				   ? _data->getDefaultSkin()->getAttachment(slotIndex, attachmentName)
				   : NULL;
}

void Skeleton::setAttachment(const String &slotName,
							 const String &attachmentName) {
	assert(slotName.length() > 0);

	for (size_t i = 0, n = _slots.size(); i < n; ++i) {
		Slot *slot = _slots[i];
		if (slot->_data.getName() == slotName) {
			Attachment *attachment = NULL;
			if (attachmentName.length() > 0) {
				attachment = getAttachment((int) i, attachmentName);

				assert(attachment != NULL);
			}

			slot->setAttachment(attachment);

			return;
		}
	}

	printf("Slot not found: %s", slotName.buffer());

	assert(false);
}

IkConstraint *Skeleton::findIkConstraint(const String &constraintName) {
	assert(constraintName.length() > 0);

	for (size_t i = 0, n = _ikConstraints.size(); i < n; ++i) {
		IkConstraint *ikConstraint = _ikConstraints[i];
		if (ikConstraint->_data.getName() == constraintName) {
			return ikConstraint;
		}
	}
	return NULL;
}

TransformConstraint *
Skeleton::findTransformConstraint(const String &constraintName) {
	assert(constraintName.length() > 0);

	for (size_t i = 0, n = _transformConstraints.size(); i < n; ++i) {
		TransformConstraint *transformConstraint = _transformConstraints[i];
		if (transformConstraint->_data.getName() == constraintName) {
			return transformConstraint;
		}
	}

	return NULL;
}

PathConstraint *Skeleton::findPathConstraint(const String &constraintName) {
	assert(constraintName.length() > 0);

	for (size_t i = 0, n = _pathConstraints.size(); i < n; ++i) {
		PathConstraint *constraint = _pathConstraints[i];
		if (constraint->_data.getName() == constraintName) {
			return constraint;
		}
	}

	return NULL;
}

PhysicsConstraint *
Skeleton::findPhysicsConstraint(const String &constraintName) {
	assert(constraintName.length() > 0);

	for (size_t i = 0, n = _physicsConstraints.size(); i < n; ++i) {
		PhysicsConstraint *constraint = _physicsConstraints[i];
		if (constraint->_data.getName() == constraintName) {
			return constraint;
		}
	}

	return NULL;
}

void Skeleton::getBounds(float &outX, float &outY, float &outWidth,
						 float &outHeight, Vector<float> &outVertexBuffer) {
	getBounds(outX, outY, outWidth, outHeight, outVertexBuffer, NULL);
}

void Skeleton::getBounds(float &outX, float &outY, float &outWidth,
						 float &outHeight, Vector<float> &outVertexBuffer, SkeletonClipping *clipper) {
	static unsigned short quadIndices[] = {0, 1, 2, 2, 3, 0};
	float minX = FLT_MAX;
	float minY = FLT_MAX;
	float maxX = -FLT_MAX;
	float maxY = -FLT_MAX;

	for (size_t i = 0; i < _drawOrder.size(); ++i) {
		Slot *slot = _drawOrder[i];
		if (!slot->_bone._active)
			continue;
		size_t verticesLength = 0;
		Attachment *attachment = slot->getAttachment();
		unsigned short *triangles = NULL;
		size_t trianglesLength = 0;

		if (attachment != NULL &&
			attachment->getRTTI().instanceOf(RegionAttachment::rtti)) {
			RegionAttachment *regionAttachment =
					static_cast<RegionAttachment *>(attachment);

			verticesLength = 8;
			if (outVertexBuffer.size() < 8) {
				outVertexBuffer.setSize(8, 0);
			}
			regionAttachment->computeWorldVertices(*slot, outVertexBuffer, 0);
			triangles = quadIndices;
			trianglesLength = 6;
		} else if (attachment != NULL &&
				   attachment->getRTTI().instanceOf(MeshAttachment::rtti)) {
			MeshAttachment *mesh = static_cast<MeshAttachment *>(attachment);

			verticesLength = mesh->getWorldVerticesLength();
			if (outVertexBuffer.size() < verticesLength) {
				outVertexBuffer.setSize(verticesLength, 0);
			}

			mesh->computeWorldVertices(*slot, 0, verticesLength,
									   outVertexBuffer.buffer(), 0);
			triangles = mesh->getTriangles().buffer();
			trianglesLength = mesh->getTriangles().size();
		} else if (attachment != NULL &&
				   attachment->getRTTI().instanceOf(ClippingAttachment::rtti) && clipper != NULL) {
			clipper->clipStart(*slot, static_cast<ClippingAttachment *>(attachment));
		}

		if (verticesLength > 0) {
			float *vertices = outVertexBuffer.buffer();
			if (clipper != NULL && clipper->isClipping()) {
				clipper->clipTriangles(outVertexBuffer.buffer(), triangles, trianglesLength);
				vertices = clipper->getClippedVertices().buffer();
				verticesLength = clipper->getClippedVertices().size();
			}
			for (size_t ii = 0; ii < verticesLength; ii += 2) {
				float vx = vertices[ii];
				float vy = vertices[ii + 1];

				minX = MathUtil::min(minX, vx);
				minY = MathUtil::min(minY, vy);
				maxX = MathUtil::max(maxX, vx);
				maxY = MathUtil::max(maxY, vy);
			}
		}
		if (clipper != NULL) clipper->clipEnd(*slot);
	}
	if (clipper != NULL) clipper->clipEnd();

	outX = minX;
	outY = minY;
	outWidth = maxX - minX;
	outHeight = maxY - minY;
}

Bone *Skeleton::getRootBone() { return _bones.size() == 0 ? NULL : _bones[0]; }

SkeletonData *Skeleton::getData() { return _data; }

Vector<Bone *> &Skeleton::getBones() { return _bones; }

Vector<Updatable *> &Skeleton::getUpdateCacheList() { return _updateCache; }

Vector<Slot *> &Skeleton::getSlots() { return _slots; }

Vector<Slot *> &Skeleton::getDrawOrder() { return _drawOrder; }

Vector<IkConstraint *> &Skeleton::getIkConstraints() { return _ikConstraints; }

Vector<PathConstraint *> &Skeleton::getPathConstraints() {
	return _pathConstraints;
}

Vector<TransformConstraint *> &Skeleton::getTransformConstraints() {
	return _transformConstraints;
}

Vector<PhysicsConstraint *> &Skeleton::getPhysicsConstraints() {
	return _physicsConstraints;
}

Skin *Skeleton::getSkin() { return _skin; }

Color &Skeleton::getColor() { return _color; }

void Skeleton::setPosition(float x, float y) {
	_x = x;
	_y = y;
}

float Skeleton::getX() { return _x; }

void Skeleton::setX(float inValue) { _x = inValue; }

float Skeleton::getY() { return _y; }

void Skeleton::setY(float inValue) { _y = inValue; }

float Skeleton::getScaleX() { return _scaleX; }

void Skeleton::setScaleX(float inValue) { _scaleX = inValue; }

float Skeleton::getScaleY() { return _scaleY * (Bone::isYDown() ? -1 : 1); }

void Skeleton::setScaleY(float inValue) { _scaleY = inValue; }

void Skeleton::sortIkConstraint(IkConstraint *constraint) {
	constraint->_active =
			constraint->_target->_active &&
			(!constraint->_data.isSkinRequired() ||
			 (_skin && _skin->_constraints.contains(&constraint->_data)));
	if (!constraint->_active)
		return;

	Bone *target = constraint->getTarget();
	sortBone(target);

	Vector<Bone *> &constrained = constraint->getBones();
	Bone *parent = constrained[0];
	sortBone(parent);

	if (constrained.size() == 1) {
		_updateCache.add(constraint);
		sortReset(parent->_children);
	} else {
		Bone *child = constrained[constrained.size() - 1];
		sortBone(child);

		_updateCache.add(constraint);

		sortReset(parent->_children);
		child->_sorted = true;
	}
}

void Skeleton::sortPathConstraint(PathConstraint *constraint) {
	constraint->_active =
			constraint->_target->_bone._active &&
			(!constraint->_data.isSkinRequired() ||
			 (_skin && _skin->_constraints.contains(&constraint->_data)));
	if (!constraint->_active)
		return;

	Slot *slot = constraint->getTarget();
	int slotIndex = slot->getData().getIndex();
	Bone &slotBone = slot->getBone();
	if (_skin != NULL)
		sortPathConstraintAttachment(_skin, slotIndex, slotBone);
	if (_data->_defaultSkin != NULL && _data->_defaultSkin != _skin)
		sortPathConstraintAttachment(_data->_defaultSkin, slotIndex, slotBone);
	for (size_t ii = 0, nn = _data->_skins.size(); ii < nn; ii++)
		sortPathConstraintAttachment(_data->_skins[ii], slotIndex, slotBone);

	Attachment *attachment = slot->getAttachment();
	if (attachment != NULL &&
		attachment->getRTTI().instanceOf(PathAttachment::rtti))
		sortPathConstraintAttachment(attachment, slotBone);

	Vector<Bone *> &constrained = constraint->getBones();
	size_t boneCount = constrained.size();
	for (size_t i = 0; i < boneCount; ++i) {
		sortBone(constrained[i]);
	}

	_updateCache.add(constraint);

	for (size_t i = 0; i < boneCount; i++)
		sortReset(constrained[i]->getChildren());
	for (size_t i = 0; i < boneCount; i++)
		constrained[i]->_sorted = true;
}

void Skeleton::sortTransformConstraint(TransformConstraint *constraint) {
	constraint->_active =
			constraint->_target->_active &&
			(!constraint->_data.isSkinRequired() ||
			 (_skin && _skin->_constraints.contains(&constraint->_data)));
	if (!constraint->_active)
		return;

	sortBone(constraint->getTarget());

	Vector<Bone *> &constrained = constraint->getBones();
	size_t boneCount = constrained.size();
	if (constraint->_data.isLocal()) {
		for (size_t i = 0; i < boneCount; i++) {
			Bone *child = constrained[i];
			sortBone(child->getParent());
			sortBone(child);
		}
	} else {
		for (size_t i = 0; i < boneCount; ++i) {
			sortBone(constrained[i]);
		}
	}

	_updateCache.add(constraint);

	for (size_t i = 0; i < boneCount; ++i)
		sortReset(constrained[i]->getChildren());
	for (size_t i = 0; i < boneCount; ++i)
		constrained[i]->_sorted = true;
}

void Skeleton::sortPhysicsConstraint(PhysicsConstraint *constraint) {
	Bone *bone = constraint->getBone();
	constraint->_active =
			bone->_active &&
			(!constraint->_data.isSkinRequired() ||
			 (_skin && _skin->_constraints.contains(&constraint->_data)));
	if (!constraint->_active)
		return;

	sortBone(bone);
	_updateCache.add(constraint);
	sortReset(bone->getChildren());
	bone->_sorted = true;
}

void Skeleton::sortPathConstraintAttachment(Skin *skin, size_t slotIndex,
											Bone &slotBone) {
	Skin::AttachmentMap::Entries attachments = skin->getAttachments();

	while (attachments.hasNext()) {
		Skin::AttachmentMap::Entry entry = attachments.next();
		if (entry._slotIndex == slotIndex) {
			Attachment *value = entry._attachment;
			sortPathConstraintAttachment(value, slotBone);
		}
	}
}

void Skeleton::sortPathConstraintAttachment(Attachment *attachment,
											Bone &slotBone) {
	if (attachment == NULL ||
		!attachment->getRTTI().instanceOf(PathAttachment::rtti))
		return;
	Vector<int> &pathBones =
			static_cast<PathAttachment *>(attachment)->getBones();
	if (pathBones.size() == 0)
		sortBone(&slotBone);
	else {
		for (size_t i = 0, n = pathBones.size(); i < n;) {
			size_t nn = pathBones[i++];
			nn += i;
			while (i < nn) {
				sortBone(_bones[pathBones[i++]]);
			}
		}
	}
}

void Skeleton::sortBone(Bone *bone) {
	if (bone->_sorted)
		return;
	Bone *parent = bone->_parent;
	if (parent != NULL)
		sortBone(parent);
	bone->_sorted = true;
	_updateCache.add(bone);
}

void Skeleton::sortReset(Vector<Bone *> &bones) {
	for (size_t i = 0, n = bones.size(); i < n; ++i) {
		Bone *bone = bones[i];
		if (!bone->_active)
			continue;
		if (bone->_sorted)
			sortReset(bone->getChildren());
		bone->_sorted = false;
	}
}

float Skeleton::getTime() { return _time; }

void Skeleton::setTime(float time) { _time = time; }

void Skeleton::update(float delta) { _time += delta; }

void Skeleton::physicsTranslate(float x, float y) {
	for (int i = 0; i < (int) _physicsConstraints.size(); i++) {
		_physicsConstraints[i]->translate(x, y);
	}
}

void Skeleton::physicsRotate(float x, float y, float degrees) {
	for (int i = 0; i < (int) _physicsConstraints.size(); i++) {
		_physicsConstraints[i]->rotate(x, y, degrees);
	}
}
