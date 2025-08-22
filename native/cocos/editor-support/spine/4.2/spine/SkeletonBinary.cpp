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

#include <spine/SkeletonBinary.h>

#include <spine/Animation.h>
#include <spine/Atlas.h>
#include <spine/AtlasAttachmentLoader.h>
#include <spine/Attachment.h>
#include <spine/CurveTimeline.h>
#include <spine/LinkedMesh.h>
#include <spine/SkeletonData.h>
#include <spine/Skin.h>
#include <spine/VertexAttachment.h>

#include <spine/AttachmentTimeline.h>
#include <spine/AttachmentType.h>
#include <spine/BoneData.h>
#include <spine/BoundingBoxAttachment.h>
#include <spine/ClippingAttachment.h>
#include <spine/ColorTimeline.h>
#include <spine/ContainerUtil.h>
#include <spine/DeformTimeline.h>
#include <spine/DrawOrderTimeline.h>
#include <spine/Event.h>
#include <spine/EventData.h>
#include <spine/EventTimeline.h>
#include <spine/IkConstraintData.h>
#include <spine/IkConstraintTimeline.h>
#include <spine/InheritTimeline.h>
#include <spine/MeshAttachment.h>
#include <spine/PathAttachment.h>
#include <spine/PathConstraintData.h>
#include <spine/PathConstraintMixTimeline.h>
#include <spine/PathConstraintPositionTimeline.h>
#include <spine/PathConstraintSpacingTimeline.h>
#include <spine/PhysicsConstraintData.h>
#include <spine/PhysicsConstraintTimeline.h>
#include <spine/PointAttachment.h>
#include <spine/RegionAttachment.h>
#include <spine/RotateTimeline.h>
#include <spine/ScaleTimeline.h>
#include <spine/ShearTimeline.h>
#include <spine/SlotData.h>
#include <spine/TransformConstraintData.h>
#include <spine/TransformConstraintTimeline.h>
#include <spine/TranslateTimeline.h>
#include <spine/SequenceTimeline.h>
#include <spine/Version.h>

using namespace spine;

SkeletonBinary::SkeletonBinary(Atlas *atlasArray) : _attachmentLoader(
															new (__FILE__, __LINE__) AtlasAttachmentLoader(atlasArray)),
													_error(), _scale(1), _ownsLoader(true) {
}

SkeletonBinary::SkeletonBinary(AttachmentLoader *attachmentLoader, bool ownsLoader) : _attachmentLoader(
																							  attachmentLoader),
																					  _error(),
																					  _scale(1),
																					  _ownsLoader(ownsLoader) {
	assert(_attachmentLoader != NULL);
}

SkeletonBinary::~SkeletonBinary() {
	ContainerUtil::cleanUpVectorOfPointers(_linkedMeshes);
	_linkedMeshes.clear();

	if (_ownsLoader) delete _attachmentLoader;
}

SkeletonData *SkeletonBinary::readSkeletonData(const unsigned char *binary, const int length) {
	bool nonessential;
	SkeletonData *skeletonData;

	DataInput *input = new (__FILE__, __LINE__) DataInput();
	input->cursor = binary;
	input->end = binary + length;

	_linkedMeshes.clear();

	skeletonData = new (__FILE__, __LINE__) SkeletonData();

	char buffer[16] = {0};
	int lowHash = readInt(input);
	int hightHash = readInt(input);
	String hashString;
	snprintf(buffer, 16, "%x", hightHash);
	hashString.append(buffer);
	snprintf(buffer, 16, "%x", lowHash);
	hashString.append(buffer);
	skeletonData->_hash = hashString;

	char *skeletonDataVersion = readString(input);
	skeletonData->_version.own(skeletonDataVersion);

	if (!skeletonData->_version.startsWith(SPINE_VERSION_STRING)) {
		char errorMsg[255];
		snprintf(errorMsg, 255, "Skeleton version %s does not match runtime version %s", skeletonData->_version.buffer(), SPINE_VERSION_STRING);
		setError(errorMsg, "");
		delete input;
		delete skeletonData;
		return NULL;
	}

	skeletonData->_x = readFloat(input);
	skeletonData->_y = readFloat(input);
	skeletonData->_width = readFloat(input);
	skeletonData->_height = readFloat(input);
	skeletonData->_referenceScale = readFloat(input) * this->_scale;

	nonessential = readBoolean(input);

	if (nonessential) {
		skeletonData->_fps = readFloat(input);
		skeletonData->_imagesPath.own(readString(input));
		skeletonData->_audioPath.own(readString(input));
	}

	int numStrings = readVarint(input, true);
	for (int i = 0; i < numStrings; i++)
		skeletonData->_strings.add(readString(input));

	/* Bones. */
	int numBones = readVarint(input, true);
	skeletonData->_bones.setSize(numBones, 0);
	for (int i = 0; i < numBones; ++i) {
		const char *name = readString(input);
		BoneData *parent = i == 0 ? 0 : skeletonData->_bones[readVarint(input, true)];
		BoneData *data = new (__FILE__, __LINE__) BoneData(i, String(name, true), parent);
		data->_rotation = readFloat(input);
		data->_x = readFloat(input) * _scale;
		data->_y = readFloat(input) * _scale;
		data->_scaleX = readFloat(input);
		data->_scaleY = readFloat(input);
		data->_shearX = readFloat(input);
		data->_shearY = readFloat(input);
		data->_length = readFloat(input) * _scale;
		data->_inherit = static_cast<Inherit>(readVarint(input, true));
		data->_skinRequired = readBoolean(input);
		if (nonessential) {
			readColor(input, data->getColor());
			data->_icon.own(readString(input));
			data->_visible = readBoolean(input);
		}
		skeletonData->_bones[i] = data;
	}

	/* Slots. */
	int slotsCount = readVarint(input, true);
	skeletonData->_slots.setSize(slotsCount, 0);
	for (int i = 0; i < slotsCount; ++i) {
		String slotName = String(readString(input), true);
		BoneData *boneData = skeletonData->_bones[readVarint(input, true)];
		SlotData *slotData = new (__FILE__, __LINE__) SlotData(i, slotName, *boneData);

		readColor(input, slotData->getColor());
		unsigned char a = readByte(input);
		unsigned char r = readByte(input);
		unsigned char g = readByte(input);
		unsigned char b = readByte(input);
		if (!(r == 0xff && g == 0xff && b == 0xff && a == 0xff)) {
			slotData->getDarkColor().set(r / 255.0f, g / 255.0f, b / 255.0f, 1);
			slotData->setHasDarkColor(true);
		}
		slotData->_attachmentName = readStringRef(input, skeletonData);
		slotData->_blendMode = static_cast<BlendMode>(readVarint(input, true));
		if (nonessential) {
			slotData->_visible = readBoolean(input);
		}
		skeletonData->_slots[i] = slotData;
	}

	/* IK constraints. */
	int ikConstraintsCount = readVarint(input, true);
	skeletonData->_ikConstraints.setSize(ikConstraintsCount, 0);
	for (int i = 0; i < ikConstraintsCount; ++i) {
		const char *name = readString(input);
		IkConstraintData *data = new (__FILE__, __LINE__) IkConstraintData(String(name, true));
		data->setOrder(readVarint(input, true));
		int bonesCount = readVarint(input, true);
		data->_bones.setSize(bonesCount, 0);
		for (int ii = 0; ii < bonesCount; ++ii)
			data->_bones[ii] = skeletonData->_bones[readVarint(input, true)];
		data->_target = skeletonData->_bones[readVarint(input, true)];
		int flags = readByte(input);
		data->_skinRequired = (flags & 1) != 0;
		data->_bendDirection = (flags & 2) != 0 ? 1 : -1;
		data->_compress = (flags & 4) != 0;
		data->_stretch = (flags & 8) != 0;
		data->_uniform = (flags & 16) != 0;
		if ((flags & 32) != 0) data->_mix = (flags & 64) != 0 ? readFloat(input) : 1;
		if ((flags & 128) != 0) data->_softness = readFloat(input) * _scale;

		skeletonData->_ikConstraints[i] = data;
	}

	/* Transform constraints. */
	int transformConstraintsCount = readVarint(input, true);
	skeletonData->_transformConstraints.setSize(transformConstraintsCount, 0);
	for (int i = 0; i < transformConstraintsCount; ++i) {
		const char *name = readString(input);
		TransformConstraintData *data = new (__FILE__, __LINE__) TransformConstraintData(String(name, true));
		data->setOrder(readVarint(input, true));
		int bonesCount = readVarint(input, true);
		data->_bones.setSize(bonesCount, 0);
		for (int ii = 0; ii < bonesCount; ++ii)
			data->_bones[ii] = skeletonData->_bones[readVarint(input, true)];
		data->_target = skeletonData->_bones[readVarint(input, true)];
		int flags = readByte(input);
		data->_skinRequired = (flags & 1) != 0;
		data->_local = (flags & 2) != 0;
		data->_relative = (flags & 4) != 0;
		if ((flags & 8) != 0) data->_offsetRotation = readFloat(input);
		if ((flags & 16) != 0) data->_offsetX = readFloat(input) * _scale;
		if ((flags & 32) != 0) data->_offsetY = readFloat(input) * _scale;
		if ((flags & 64) != 0) data->_offsetScaleX = readFloat(input);
		if ((flags & 128) != 0) data->_offsetScaleY = readFloat(input);
		flags = readByte(input);
		if ((flags & 1) != 0) data->_offsetShearY = readFloat(input);
		if ((flags & 2) != 0) data->_mixRotate = readFloat(input);
		if ((flags & 4) != 0) data->_mixX = readFloat(input);
		if ((flags & 8) != 0) data->_mixY = readFloat(input);
		if ((flags & 16) != 0) data->_mixScaleX = readFloat(input);
		if ((flags & 32) != 0) data->_mixScaleY = readFloat(input);
		if ((flags & 64) != 0) data->_mixShearY = readFloat(input);

		skeletonData->_transformConstraints[i] = data;
	}

	/* Path constraints */
	int pathConstraintsCount = readVarint(input, true);
	skeletonData->_pathConstraints.setSize(pathConstraintsCount, 0);
	for (int i = 0; i < pathConstraintsCount; ++i) {
		const char *name = readString(input);
		PathConstraintData *data = new (__FILE__, __LINE__) PathConstraintData(String(name, true));
		data->setOrder(readVarint(input, true));
		data->setSkinRequired(readBoolean(input));
		int bonesCount = readVarint(input, true);
		data->_bones.setSize(bonesCount, 0);
		for (int ii = 0; ii < bonesCount; ++ii)
			data->_bones[ii] = skeletonData->_bones[readVarint(input, true)];
		data->_target = skeletonData->_slots[readVarint(input, true)];
		int flags = readByte(input);
		data->_positionMode = (PositionMode) (flags & 1);
		data->_spacingMode = (SpacingMode) ((flags >> 1) & 3);
		data->_rotateMode = (RotateMode) ((flags >> 3) & 3);
		if ((flags & 128) != 0) data->_offsetRotation = readFloat(input);
		data->_position = readFloat(input);
		if (data->_positionMode == PositionMode_Fixed) data->_position *= _scale;
		data->_spacing = readFloat(input);
		if (data->_spacingMode == SpacingMode_Length || data->_spacingMode == SpacingMode_Fixed)
			data->_spacing *= _scale;
		data->_mixRotate = readFloat(input);
		data->_mixX = readFloat(input);
		data->_mixY = readFloat(input);
		skeletonData->_pathConstraints[i] = data;
	}

	// Physics constraints.
	int physicsConstraintsCount = readVarint(input, true);
	skeletonData->_physicsConstraints.setSize(physicsConstraintsCount, 0);
	for (int i = 0; i < physicsConstraintsCount; i++) {
		const char *name = readString(input);
		PhysicsConstraintData *data = new (__FILE__, __LINE__) PhysicsConstraintData(String(name, true));
		data->_order = readVarint(input, true);
		data->_bone = skeletonData->_bones[readVarint(input, true)];
		int flags = readByte(input);
		data->_skinRequired = (flags & 1) != 0;
		if ((flags & 2) != 0) data->_x = readFloat(input);
		if ((flags & 4) != 0) data->_y = readFloat(input);
		if ((flags & 8) != 0) data->_rotate = readFloat(input);
		if ((flags & 16) != 0) data->_scaleX = readFloat(input);
		if ((flags & 32) != 0) data->_shearX = readFloat(input);
		data->_limit = ((flags & 64) != 0 ? readFloat(input) : 5000) * _scale;
		data->_step = 1.f / readByte(input);
		data->_inertia = readFloat(input);
		data->_strength = readFloat(input);
		data->_damping = readFloat(input);
		data->_massInverse = (flags & 128) != 0 ? readFloat(input) : 1;
		data->_wind = readFloat(input);
		data->_gravity = readFloat(input);
		flags = readByte(input);
		if ((flags & 1) != 0) data->_inertiaGlobal = true;
		if ((flags & 2) != 0) data->_strengthGlobal = true;
		if ((flags & 4) != 0) data->_dampingGlobal = true;
		if ((flags & 8) != 0) data->_massGlobal = true;
		if ((flags & 16) != 0) data->_windGlobal = true;
		if ((flags & 32) != 0) data->_gravityGlobal = true;
		if ((flags & 64) != 0) data->_mixGlobal = true;
		data->_mix = (flags & 128) != 0 ? readFloat(input) : 1;
		skeletonData->_physicsConstraints[i] = data;
	}

	/* Default skin. */
	Skin *defaultSkin = readSkin(input, true, skeletonData, nonessential);
	if (defaultSkin) {
		skeletonData->_defaultSkin = defaultSkin;
		skeletonData->_skins.add(defaultSkin);
	}

	if (!this->getError().isEmpty()) {
		delete input;
		delete skeletonData;
		return NULL;
	}

	/* Skins. */
	for (size_t i = 0, n = (size_t) readVarint(input, true); i < n; ++i) {
		Skin *skin = readSkin(input, false, skeletonData, nonessential);
		if (skin)
			skeletonData->_skins.add(skin);
		else {
			delete input;
			delete skeletonData;
			return NULL;
		}
	}

	/* Linked meshes. */
	for (int i = 0, n = (int) _linkedMeshes.size(); i < n; ++i) {
		LinkedMesh *linkedMesh = _linkedMeshes[i];
		Skin *skin = skeletonData->_skins[linkedMesh->_skinIndex];
		Attachment *parent = skin->getAttachment(linkedMesh->_slotIndex, linkedMesh->_parent);
		if (parent == NULL) {
			delete input;
			delete skeletonData;
			setError("Parent mesh not found: ", linkedMesh->_parent.buffer());
			return NULL;
		}
		linkedMesh->_mesh->_timelineAttachment = linkedMesh->_inheritTimeline ? static_cast<VertexAttachment *>(parent)
																			  : linkedMesh->_mesh;
		linkedMesh->_mesh->setParentMesh(static_cast<MeshAttachment *>(parent));
		if (linkedMesh->_mesh->_region) linkedMesh->_mesh->updateRegion();
		_attachmentLoader->configureAttachment(linkedMesh->_mesh);
	}
	ContainerUtil::cleanUpVectorOfPointers(_linkedMeshes);
	_linkedMeshes.clear();

	/* Events. */
	int eventsCount = readVarint(input, true);
	skeletonData->_events.setSize(eventsCount, 0);
	for (int i = 0; i < eventsCount; ++i) {
		const char *name = readString(input);
		EventData *eventData = new (__FILE__, __LINE__) EventData(String(name, true));
		eventData->_intValue = readVarint(input, false);
		eventData->_floatValue = readFloat(input);
		eventData->_stringValue.own(readString(input));
		eventData->_audioPath.own(readString(input));
		if (!eventData->_audioPath.isEmpty()) {
			eventData->_volume = readFloat(input);
			eventData->_balance = readFloat(input);
		}
		skeletonData->_events[i] = eventData;
	}

	/* Animations. */
	int animationsCount = readVarint(input, true);
	skeletonData->_animations.setSize(animationsCount, 0);
	for (int i = 0; i < animationsCount; ++i) {
		String name(readString(input), true);
		Animation *animation = readAnimation(name, input, skeletonData);
		if (!animation) {
			delete input;
			delete skeletonData;
			return NULL;
		}
		skeletonData->_animations[i] = animation;
	}

	delete input;
	return skeletonData;
}

SkeletonData *SkeletonBinary::readSkeletonDataFile(const String &path) {
	int length;
	SkeletonData *skeletonData;
	const char *binary = SpineExtension::readFile(path.buffer(), &length);
	if (length == 0 || !binary) {
		setError("Unable to read skeleton file: ", path.buffer());
		return NULL;
	}
	skeletonData = readSkeletonData((unsigned char *) binary, length);
	SpineExtension::free(binary, __FILE__, __LINE__);
	return skeletonData;
}

void SkeletonBinary::setError(const char *value1, const char *value2) {
	char message[256];
	int length;
	strcpy(message, value1);
	length = (int) strlen(value1);
	if (value2) strncat(message + length, value2, 255 - length);
	_error = String(message);
}

char *SkeletonBinary::readString(DataInput *input) {
	int length = readVarint(input, true);
	char *string;
	if (length == 0) return NULL;
	string = SpineExtension::alloc<char>(length, __FILE__, __LINE__);
	memcpy(string, input->cursor, length - 1);
	input->cursor += length - 1;
	string[length - 1] = '\0';
	return string;
}

char *SkeletonBinary::readStringRef(DataInput *input, SkeletonData *skeletonData) {
	int index = readVarint(input, true);
	return index == 0 ? NULL : skeletonData->_strings[index - 1];
}

float SkeletonBinary::readFloat(DataInput *input) {
	union {
		int intValue;
		float floatValue;
	} intToFloat;
	intToFloat.intValue = readInt(input);
	return intToFloat.floatValue;
}

unsigned char SkeletonBinary::readByte(DataInput *input) {
	return *input->cursor++;
}

signed char SkeletonBinary::readSByte(DataInput *input) {
	return (signed char) readByte(input);
}

bool SkeletonBinary::readBoolean(DataInput *input) {
	return readByte(input) != 0;
}

int SkeletonBinary::readInt(DataInput *input) {
	int result = readByte(input);
	result <<= 8;
	result |= readByte(input);
	result <<= 8;
	result |= readByte(input);
	result <<= 8;
	result |= readByte(input);
	return result;
}

void SkeletonBinary::readColor(DataInput *input, Color &color) {
	color.r = readByte(input) / 255.0f;
	color.g = readByte(input) / 255.0f;
	color.b = readByte(input) / 255.0f;
	color.a = readByte(input) / 255.0f;
}

int SkeletonBinary::readVarint(DataInput *input, bool optimizePositive) {
	unsigned char b = readByte(input);
	int value = b & 0x7F;
	if (b & 0x80) {
		b = readByte(input);
		value |= (b & 0x7F) << 7;
		if (b & 0x80) {
			b = readByte(input);
			value |= (b & 0x7F) << 14;
			if (b & 0x80) {
				b = readByte(input);
				value |= (b & 0x7F) << 21;
				if (b & 0x80) value |= (readByte(input) & 0x7F) << 28;
			}
		}
	}
	if (!optimizePositive) value = (((unsigned int) value >> 1) ^ -(value & 1));
	return value;
}

Skin *SkeletonBinary::readSkin(DataInput *input, bool defaultSkin, SkeletonData *skeletonData, bool nonessential) {
	Skin *skin;
	int slotCount = 0;
	if (defaultSkin) {
		slotCount = readVarint(input, true);
		if (slotCount == 0) return NULL;
		skin = new (__FILE__, __LINE__) Skin("default");
	} else {
		skin = new (__FILE__, __LINE__) Skin(String(readString(input), true));

		if (nonessential) readColor(input, skin->getColor());

		for (int i = 0, n = readVarint(input, true); i < n; i++) {
			int boneIndex = readVarint(input, true);
			if (boneIndex >= (int) skeletonData->_bones.size()) return NULL;
			skin->getBones().add(skeletonData->_bones[boneIndex]);
		}

		for (int i = 0, n = readVarint(input, true); i < n; i++) {
			int ikIndex = readVarint(input, true);
			if (ikIndex >= (int) skeletonData->_ikConstraints.size()) return NULL;
			skin->getConstraints().add(skeletonData->_ikConstraints[ikIndex]);
		}

		for (int i = 0, n = readVarint(input, true); i < n; i++) {
			int transformIndex = readVarint(input, true);
			if (transformIndex >= (int) skeletonData->_transformConstraints.size()) return NULL;
			skin->getConstraints().add(skeletonData->_transformConstraints[transformIndex]);
		}

		for (int i = 0, n = readVarint(input, true); i < n; i++) {
			int pathIndex = readVarint(input, true);
			if (pathIndex >= (int) skeletonData->_pathConstraints.size()) return NULL;
			skin->getConstraints().add(skeletonData->_pathConstraints[pathIndex]);
		}

		for (int i = 0, n = readVarint(input, true); i < n; i++) {
			int physicsIndex = readVarint(input, true);
			if (physicsIndex >= (int) skeletonData->_physicsConstraints.size()) return NULL;
			skin->getConstraints().add(skeletonData->_physicsConstraints[physicsIndex]);
		}
		slotCount = readVarint(input, true);
	}

	for (int i = 0; i < slotCount; ++i) {
		int slotIndex = readVarint(input, true);
		for (int ii = 0, nn = readVarint(input, true); ii < nn; ++ii) {
			String name(readStringRef(input, skeletonData));
			Attachment *attachment = readAttachment(input, skin, slotIndex, name, skeletonData, nonessential);
			if (attachment)
				skin->setAttachment(slotIndex, String(name), attachment);
			else {
				delete skin;
				return NULL;
			}
		}
	}
	return skin;
}

Sequence *SkeletonBinary::readSequence(DataInput *input) {
	Sequence *sequence = new (__FILE__, __LINE__) Sequence(readVarint(input, true));
	sequence->_start = readVarint(input, true);
	sequence->_digits = readVarint(input, true);
	sequence->_setupIndex = readVarint(input, true);
	return sequence;
}

Attachment *SkeletonBinary::readAttachment(DataInput *input, Skin *skin, int slotIndex, const String &attachmentName,
										   SkeletonData *skeletonData, bool nonessential) {

	int flags = readByte(input);
	String name = (flags & 8) != 0 ? readStringRef(input, skeletonData) : attachmentName;
	AttachmentType type = static_cast<AttachmentType>(flags & 0x7);
	switch (type) {
		case AttachmentType_Region: {
			String path = (flags & 16) != 0 ? readStringRef(input, skeletonData) : name;
			Color color(1, 1, 1, 1);
			if ((flags & 32) != 0) readColor(input, color);
			Sequence *sequence = (flags & 64) != 0 ? readSequence(input) : nullptr;
			float rotation = (flags & 128) != 0 ? readFloat(input) : 0;
			float x = readFloat(input) * _scale;
			float y = readFloat(input) * _scale;
			float scaleX = readFloat(input);
			float scaleY = readFloat(input);
			float width = readFloat(input) * _scale;
			float height = readFloat(input) * _scale;
			RegionAttachment *region = _attachmentLoader->newRegionAttachment(*skin, String(name), String(path), sequence);
			if (!region) {
				setError("Error reading attachment: ", name.buffer());
				return NULL;
			}
			region->_path = path;
			region->_rotation = rotation;
			region->_x = x;
			region->_y = y;
			region->_scaleX = scaleX;
			region->_scaleY = scaleY;
			region->_width = width;
			region->_height = height;
			region->getColor().set(color);
			region->_sequence = sequence;
			if (sequence == NULL) region->updateRegion();
			_attachmentLoader->configureAttachment(region);
			return region;
		}
		case AttachmentType_Boundingbox: {
			BoundingBoxAttachment *box = _attachmentLoader->newBoundingBoxAttachment(*skin, String(name));
			if (!box) {
				setError("Error reading attachment: ", name.buffer());
				return NULL;
			}
			int verticesLength = readVertices(input, box->getVertices(), box->getBones(), (flags & 16) != 0);
			box->setWorldVerticesLength(verticesLength);
			if (nonessential) {
				readColor(input, box->getColor());
			}
			_attachmentLoader->configureAttachment(box);
			return box;
		}
		case AttachmentType_Mesh: {
			Vector<float> uvs;
			Vector<unsigned short> triangles;
			Vector<float> vertices;
			Vector<int> bones;
			int hullLength;
			float width = 0;
			float height = 0;
			Vector<unsigned short> edges;

			String path = (flags & 16) != 0 ? readStringRef(input, skeletonData) : name;
			Color color(1, 1, 1, 1);
			if ((flags & 32) != 0) readColor(input, color);
			Sequence *sequence = (flags & 64) != 0 ? readSequence(input) : nullptr;
			hullLength = readVarint(input, true);
			int verticesLength = readVertices(input, vertices, bones, (flags & 128) != 0);
			readFloatArray(input, verticesLength, 1, uvs);
			readShortArray(input, triangles, (verticesLength - hullLength - 2) * 3);

			if (nonessential) {
				readShortArray(input, edges, readVarint(input, true));
				width = readFloat(input);
				height = readFloat(input);
			}

			MeshAttachment *mesh = _attachmentLoader->newMeshAttachment(*skin, String(name), String(path), sequence);
			if (!mesh) {
				setError("Error reading attachment: ", name.buffer());
				return NULL;
			}
			mesh->_path = path;
			mesh->_color.set(color);
			mesh->_bones.addAll(bones);
			mesh->_vertices.addAll(vertices);
			mesh->setWorldVerticesLength(verticesLength);
			mesh->_triangles.addAll(triangles);
			mesh->_regionUVs.addAll(uvs);
			if (sequence == NULL) mesh->updateRegion();
			mesh->_hullLength = hullLength;
			mesh->_sequence = sequence;
			if (nonessential) {
				mesh->_edges.addAll(edges);
				mesh->_width = width;
				mesh->_height = height;
			}
			_attachmentLoader->configureAttachment(mesh);
			return mesh;
		}
		case AttachmentType_Linkedmesh: {
			String path = (flags & 16) != 0 ? readStringRef(input, skeletonData) : name;
			Color color(1, 1, 1, 1);
			if ((flags & 32) != 0) readColor(input, color);
			Sequence *sequence = (flags & 64) != 0 ? readSequence(input) : nullptr;
			bool inheritTimelines = (flags & 128) != 0;
			int skinIndex = readVarint(input, true);
			String parent(readStringRef(input, skeletonData));
			float width = 0, height = 0;
			if (nonessential) {
				width = readFloat(input) * _scale;
				height = readFloat(input) * _scale;
			}

			MeshAttachment *mesh = _attachmentLoader->newMeshAttachment(*skin, String(name), String(path), sequence);
			if (!mesh) {
				setError("Error reading attachment: ", name.buffer());
				return NULL;
			}
			mesh->_path = path;
			mesh->_color.set(color);
			mesh->_sequence = sequence;
			if (nonessential) {
				mesh->_width = width;
				mesh->_height = height;
			}

			LinkedMesh *linkedMesh = new (__FILE__, __LINE__) LinkedMesh(mesh, skinIndex, slotIndex,
																		 String(parent), inheritTimelines);
			_linkedMeshes.add(linkedMesh);
			return mesh;
		}
		case AttachmentType_Path: {
			PathAttachment *path = _attachmentLoader->newPathAttachment(*skin, String(name));
			if (!path) {
				setError("Error reading attachment: ", name.buffer());
				return NULL;
			}
			path->_closed = (flags & 16) != 0;
			path->_constantSpeed = (flags & 32) != 0;
			int verticesLength = readVertices(input, path->getVertices(), path->getBones(), (flags & 64) != 0);
			path->setWorldVerticesLength(verticesLength);
			int lengthsLength = verticesLength / 6;
			path->_lengths.setSize(lengthsLength, 0);
			for (int i = 0; i < lengthsLength; ++i) {
				path->_lengths[i] = readFloat(input) * _scale;
			}
			if (nonessential) {
				readColor(input, path->getColor());
			}
			_attachmentLoader->configureAttachment(path);
			return path;
		}
		case AttachmentType_Point: {
			PointAttachment *point = _attachmentLoader->newPointAttachment(*skin, String(name));
			if (!point) {
				setError("Error reading attachment: ", name.buffer());
				return NULL;
			}
			point->_rotation = readFloat(input);
			point->_x = readFloat(input) * _scale;
			point->_y = readFloat(input) * _scale;

			if (nonessential) {
				readColor(input, point->getColor());
			}
			_attachmentLoader->configureAttachment(point);
			return point;
		}
		case AttachmentType_Clipping: {
			int endSlotIndex = readVarint(input, true);
			ClippingAttachment *clip = _attachmentLoader->newClippingAttachment(*skin, name);
			if (!clip) {
				setError("Error reading attachment: ", name.buffer());
				return NULL;
			}
			int verticesLength = readVertices(input, clip->getVertices(), clip->getBones(), (flags & 16) != 0);
			clip->setWorldVerticesLength(verticesLength);
			clip->_endSlot = skeletonData->_slots[endSlotIndex];
			if (nonessential) {
				readColor(input, clip->getColor());
			}
			_attachmentLoader->configureAttachment(clip);
			return clip;
		}
	}
	return NULL;
}

int SkeletonBinary::readVertices(DataInput *input, Vector<float> &vertices, Vector<int> &bones, bool weighted) {
	float scale = _scale;
	int vertexCount = readVarint(input, true);
	int verticesLength = vertexCount << 1;
	if (!weighted) {
		readFloatArray(input, verticesLength, scale, vertices);
		return verticesLength;
	}
	vertices.ensureCapacity(verticesLength * 3 * 3);
	bones.ensureCapacity(verticesLength * 3);
	for (int i = 0; i < vertexCount; ++i) {
		int boneCount = readVarint(input, true);
		bones.add(boneCount);
		for (int ii = 0; ii < boneCount; ++ii) {
			bones.add(readVarint(input, true));
			vertices.add(readFloat(input) * scale);
			vertices.add(readFloat(input) * scale);
			vertices.add(readFloat(input));
		}
	}
	return verticesLength;
}

void SkeletonBinary::readFloatArray(DataInput *input, int n, float scale, Vector<float> &array) {
	array.setSize(n, 0);

	int i;
	if (scale == 1) {
		for (i = 0; i < n; ++i) {
			array[i] = readFloat(input);
		}
	} else {
		for (i = 0; i < n; ++i) {
			array[i] = readFloat(input) * scale;
		}
	}
}

void SkeletonBinary::readShortArray(DataInput *input, Vector<unsigned short> &array, int n) {
	array.setSize(n, 0);
	for (int i = 0; i < n; ++i) {
		array[i] = (short) readVarint(input, true);
	}
}

void SkeletonBinary::setBezier(DataInput *input, CurveTimeline *timeline, int bezier, int frame, int value, float time1,
							   float time2,
							   float value1, float value2, float scale) {
	float cx1 = readFloat(input);
	float cy1 = readFloat(input);
	float cx2 = readFloat(input);
	float cy2 = readFloat(input);
	timeline->setBezier(bezier, frame, value, time1, value1, cx1, cy1 * scale, cx2, cy2 * scale, time2, value2);
}

void SkeletonBinary::readTimeline(DataInput *input, Vector<Timeline *> &timelines, CurveTimeline1 *timeline, float scale) {
	float time = readFloat(input);
	float value = readFloat(input) * scale;
	for (int frame = 0, bezier = 0, frameLast = (int) timeline->getFrameCount() - 1;; frame++) {
		timeline->setFrame(frame, time, value);
		if (frame == frameLast) break;
		float time2 = readFloat(input);
		float value2 = readFloat(input) * scale;
		switch (readSByte(input)) {
			case CURVE_STEPPED:
				timeline->setStepped(frame);
				break;
			case CURVE_BEZIER:
				setBezier(input, timeline, bezier++, frame, 0, time, time2, value, value2, scale);
		}
		time = time2;
		value = value2;
	}
	timelines.add(timeline);
}

void SkeletonBinary::readTimeline2(DataInput *input, Vector<Timeline *> &timelines, CurveTimeline2 *timeline, float scale) {
	float time = readFloat(input);
	float value1 = readFloat(input) * scale;
	float value2 = readFloat(input) * scale;
	for (int frame = 0, bezier = 0, frameLast = (int) timeline->getFrameCount() - 1;; frame++) {
		timeline->setFrame(frame, time, value1, value2);
		if (frame == frameLast) break;
		float time2 = readFloat(input);
		float nvalue1 = readFloat(input) * scale;
		float nvalue2 = readFloat(input) * scale;
		switch (readSByte(input)) {
			case CURVE_STEPPED:
				timeline->setStepped(frame);
				break;
			case CURVE_BEZIER:
				setBezier(input, timeline, bezier++, frame, 0, time, time2, value1, nvalue1, scale);
				setBezier(input, timeline, bezier++, frame, 1, time, time2, value2, nvalue2, scale);
		}
		time = time2;
		value1 = nvalue1;
		value2 = nvalue2;
	}
	timelines.add(timeline);
}

Animation *SkeletonBinary::readAnimation(const String &name, DataInput *input, SkeletonData *skeletonData) {
	Vector<Timeline *> timelines;
	float scale = _scale;
	int numTimelines = readVarint(input, true);
	SP_UNUSED(numTimelines);
	// Slot timelines.
	for (int i = 0, n = readVarint(input, true); i < n; ++i) {
		int slotIndex = readVarint(input, true);
		for (int ii = 0, nn = readVarint(input, true); ii < nn; ++ii) {
			unsigned char timelineType = readByte(input);
			int frameCount = readVarint(input, true);
			int frameLast = frameCount - 1;
			switch (timelineType) {
				case SLOT_ATTACHMENT: {
					AttachmentTimeline *timeline = new (__FILE__, __LINE__) AttachmentTimeline(frameCount, slotIndex);
					for (int frame = 0; frame < frameCount; ++frame) {
						float time = readFloat(input);
						String attachmentName(readStringRef(input, skeletonData));
						timeline->setFrame(frame, time, attachmentName);
					}
					timelines.add(timeline);
					break;
				}
				case SLOT_RGBA: {
					int bezierCount = readVarint(input, true);
					RGBATimeline *timeline = new (__FILE__, __LINE__) RGBATimeline(frameCount, bezierCount, slotIndex);

					float time = readFloat(input);
					float r = readByte(input) / 255.0;
					float g = readByte(input) / 255.0;
					float b = readByte(input) / 255.0;
					float a = readByte(input) / 255.0;

					for (int frame = 0, bezier = 0;; frame++) {
						timeline->setFrame(frame, time, r, g, b, a);
						if (frame == frameLast) break;

						float time2 = readFloat(input);
						float r2 = readByte(input) / 255.0;
						float g2 = readByte(input) / 255.0;
						float b2 = readByte(input) / 255.0;
						float a2 = readByte(input) / 255.0;

						switch (readSByte(input)) {
							case CURVE_STEPPED:
								timeline->setStepped(frame);
								break;
							case CURVE_BEZIER:
								setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
								setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
								setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
								setBezier(input, timeline, bezier++, frame, 3, time, time2, a, a2, 1);
						}
						time = time2;
						r = r2;
						g = g2;
						b = b2;
						a = a2;
					}
					timelines.add(timeline);
					break;
				}
				case SLOT_RGB: {
					int bezierCount = readVarint(input, true);
					RGBTimeline *timeline = new (__FILE__, __LINE__) RGBTimeline(frameCount, bezierCount, slotIndex);

					float time = readFloat(input);
					float r = readByte(input) / 255.0;
					float g = readByte(input) / 255.0;
					float b = readByte(input) / 255.0;

					for (int frame = 0, bezier = 0;; frame++) {
						timeline->setFrame(frame, time, r, g, b);
						if (frame == frameLast) break;

						float time2 = readFloat(input);
						float r2 = readByte(input) / 255.0;
						float g2 = readByte(input) / 255.0;
						float b2 = readByte(input) / 255.0;

						switch (readSByte(input)) {
							case CURVE_STEPPED:
								timeline->setStepped(frame);
								break;
							case CURVE_BEZIER:
								setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
								setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
								setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
						}
						time = time2;
						r = r2;
						g = g2;
						b = b2;
					}
					timelines.add(timeline);
					break;
				}
				case SLOT_RGBA2: {
					int bezierCount = readVarint(input, true);
					RGBA2Timeline *timeline = new (__FILE__, __LINE__) RGBA2Timeline(frameCount, bezierCount, slotIndex);

					float time = readFloat(input);
					float r = readByte(input) / 255.0;
					float g = readByte(input) / 255.0;
					float b = readByte(input) / 255.0;
					float a = readByte(input) / 255.0;
					float r2 = readByte(input) / 255.0;
					float g2 = readByte(input) / 255.0;
					float b2 = readByte(input) / 255.0;

					for (int frame = 0, bezier = 0;; frame++) {
						timeline->setFrame(frame, time, r, g, b, a, r2, g2, b2);
						if (frame == frameLast) break;
						float time2 = readFloat(input);
						float nr = readByte(input) / 255.0;
						float ng = readByte(input) / 255.0;
						float nb = readByte(input) / 255.0;
						float na = readByte(input) / 255.0;
						float nr2 = readByte(input) / 255.0;
						float ng2 = readByte(input) / 255.0;
						float nb2 = readByte(input) / 255.0;

						switch (readSByte(input)) {
							case CURVE_STEPPED:
								timeline->setStepped(frame);
								break;
							case CURVE_BEZIER:
								setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
								setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
								setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
								setBezier(input, timeline, bezier++, frame, 3, time, time2, a, na, 1);
								setBezier(input, timeline, bezier++, frame, 4, time, time2, r2, nr2, 1);
								setBezier(input, timeline, bezier++, frame, 5, time, time2, g2, ng2, 1);
								setBezier(input, timeline, bezier++, frame, 6, time, time2, b2, nb2, 1);
						}
						time = time2;
						r = nr;
						g = ng;
						b = nb;
						a = na;
						r2 = nr2;
						g2 = ng2;
						b2 = nb2;
					}
					timelines.add(timeline);
					break;
				}
				case SLOT_RGB2: {
					int bezierCount = readVarint(input, true);
					RGB2Timeline *timeline = new (__FILE__, __LINE__) RGB2Timeline(frameCount, bezierCount, slotIndex);

					float time = readFloat(input);
					float r = readByte(input) / 255.0;
					float g = readByte(input) / 255.0;
					float b = readByte(input) / 255.0;
					float r2 = readByte(input) / 255.0;
					float g2 = readByte(input) / 255.0;
					float b2 = readByte(input) / 255.0;

					for (int frame = 0, bezier = 0;; frame++) {
						timeline->setFrame(frame, time, r, g, b, r2, g2, b2);
						if (frame == frameLast) break;
						float time2 = readFloat(input);
						float nr = readByte(input) / 255.0;
						float ng = readByte(input) / 255.0;
						float nb = readByte(input) / 255.0;
						float nr2 = readByte(input) / 255.0;
						float ng2 = readByte(input) / 255.0;
						float nb2 = readByte(input) / 255.0;

						switch (readSByte(input)) {
							case CURVE_STEPPED:
								timeline->setStepped(frame);
								break;
							case CURVE_BEZIER:
								setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
								setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
								setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
								setBezier(input, timeline, bezier++, frame, 3, time, time2, r2, nr2, 1);
								setBezier(input, timeline, bezier++, frame, 4, time, time2, g2, ng2, 1);
								setBezier(input, timeline, bezier++, frame, 5, time, time2, b2, nb2, 1);
						}
						time = time2;
						r = nr;
						g = ng;
						b = nb;
						r2 = nr2;
						g2 = ng2;
						b2 = nb2;
					}
					timelines.add(timeline);
					break;
				}
				case SLOT_ALPHA: {
					int bezierCount = readVarint(input, true);
					AlphaTimeline *timeline = new (__FILE__, __LINE__) AlphaTimeline(frameCount, bezierCount, slotIndex);
					float time = readFloat(input);
					float a = readByte(input) / 255.0;
					for (int frame = 0, bezier = 0;; frame++) {
						timeline->setFrame(frame, time, a);
						if (frame == frameLast) break;
						float time2 = readFloat(input);
						float a2 = readByte(input) / 255.0;
						switch (readSByte(input)) {
							case CURVE_STEPPED:
								timeline->setStepped(frame);
								break;
							case CURVE_BEZIER:
								setBezier(input, timeline, bezier++, frame, 0, time, time2, a, a2, 1);
						}
						time = time2;
						a = a2;
					}
					timelines.add(timeline);
					break;
				}
				default: {
					ContainerUtil::cleanUpVectorOfPointers(timelines);
					setError("Invalid timeline type for a slot: ", skeletonData->_slots[slotIndex]->_name.buffer());
					return NULL;
				}
			}
		}
	}

	// Bone timelines.
	for (int i = 0, n = readVarint(input, true); i < n; ++i) {
		int boneIndex = readVarint(input, true);
		for (int ii = 0, nn = readVarint(input, true); ii < nn; ++ii) {
			unsigned char timelineType = readByte(input);
			int frameCount = readVarint(input, true);
			if (timelineType == BONE_INHERIT) {
				InheritTimeline *timeline = new (__FILE__, __LINE__) InheritTimeline(frameCount, boneIndex);
				for (int frame = 0; frame < frameCount; frame++) {
					float time = readFloat(input);
					Inherit inherit = (Inherit) readByte(input);
					timeline->setFrame(frame, time, inherit);
				}
				timelines.add(timeline);
				continue;
			}
			int bezierCount = readVarint(input, true);
			switch (timelineType) {
				case BONE_ROTATE:
					readTimeline(input, timelines,
								 new (__FILE__, __LINE__) RotateTimeline(frameCount, bezierCount, boneIndex),
								 1);
					break;
				case BONE_TRANSLATE:
					readTimeline2(input, timelines, new (__FILE__, __LINE__) TranslateTimeline(frameCount, bezierCount, boneIndex), scale);
					break;
				case BONE_TRANSLATEX:
					readTimeline(input, timelines, new (__FILE__, __LINE__) TranslateXTimeline(frameCount, bezierCount, boneIndex), scale);
					break;
				case BONE_TRANSLATEY:
					readTimeline(input, timelines, new (__FILE__, __LINE__) TranslateYTimeline(frameCount, bezierCount, boneIndex), scale);
					break;
				case BONE_SCALE:
					readTimeline2(input, timelines,
								  new (__FILE__, __LINE__) ScaleTimeline(frameCount, bezierCount, boneIndex),
								  1);
					break;
				case BONE_SCALEX:
					readTimeline(input, timelines,
								 new (__FILE__, __LINE__) ScaleXTimeline(frameCount, bezierCount, boneIndex),
								 1);
					break;
				case BONE_SCALEY:
					readTimeline(input, timelines,
								 new (__FILE__, __LINE__) ScaleYTimeline(frameCount, bezierCount, boneIndex),
								 1);
					break;
				case BONE_SHEAR:
					readTimeline2(input, timelines,
								  new (__FILE__, __LINE__) ShearTimeline(frameCount, bezierCount, boneIndex),
								  1);
					break;
				case BONE_SHEARX:
					readTimeline(input, timelines,
								 new (__FILE__, __LINE__) ShearXTimeline(frameCount, bezierCount, boneIndex),
								 1);
					break;
				case BONE_SHEARY:
					readTimeline(input, timelines,
								 new (__FILE__, __LINE__) ShearYTimeline(frameCount, bezierCount, boneIndex),
								 1);
					break;
				default: {
					ContainerUtil::cleanUpVectorOfPointers(timelines);
					setError("Invalid timeline type for a bone: ", skeletonData->_bones[boneIndex]->_name.buffer());
					return NULL;
				}
			}
		}
	}

	// IK timelines.
	for (int i = 0, n = readVarint(input, true); i < n; ++i) {
		int index = readVarint(input, true);
		int frameCount = readVarint(input, true);
		int frameLast = frameCount - 1;
		int bezierCount = readVarint(input, true);
		IkConstraintTimeline *timeline = new (__FILE__, __LINE__) IkConstraintTimeline(frameCount, bezierCount, index);
		int flags = readByte(input);
		float time = readFloat(input), mix = (flags & 1) != 0 ? ((flags & 2) != 0 ? readFloat(input) : 1) : 0;
		float softness = (flags & 4) != 0 ? readFloat(input) * scale : 0;
		for (int frame = 0, bezier = 0;; frame++) {
			timeline->setFrame(frame, time, mix, softness, (flags & 8) != 0 ? 1 : -1, (flags & 16) != 0, (flags & 32) != 0);
			if (frame == frameLast) break;
			flags = readByte(input);
			float time2 = readFloat(input), mix2 = (flags & 1) != 0 ? ((flags & 2) != 0 ? readFloat(input) : 1) : 0;
			float softness2 = (flags & 4) != 0 ? readFloat(input) * scale : 0;
			if ((flags & 64) != 0)
				timeline->setStepped(frame);
			else if ((flags & 128) != 0) {
				setBezier(input, timeline, bezier++, frame, 0, time, time2, mix, mix2, 1);
				setBezier(input, timeline, bezier++, frame, 1, time, time2, softness, softness2, scale);
			}
			time = time2;
			mix = mix2;
			softness = softness2;
		}
		timelines.add(timeline);
	}

	// Transform constraint timelines.
	for (int i = 0, n = readVarint(input, true); i < n; ++i) {
		int index = readVarint(input, true);
		int frameCount = readVarint(input, true);
		int frameLast = frameCount - 1;
		int bezierCount = readVarint(input, true);
		TransformConstraintTimeline *timeline = new TransformConstraintTimeline(frameCount, bezierCount, index);
		float time = readFloat(input);
		float mixRotate = readFloat(input);
		float mixX = readFloat(input);
		float mixY = readFloat(input);
		float mixScaleX = readFloat(input);
		float mixScaleY = readFloat(input);
		float mixShearY = readFloat(input);
		for (int frame = 0, bezier = 0;; frame++) {
			timeline->setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
			if (frame == frameLast) break;
			float time2 = readFloat(input);
			float mixRotate2 = readFloat(input);
			float mixX2 = readFloat(input);
			float mixY2 = readFloat(input);
			float mixScaleX2 = readFloat(input);
			float mixScaleY2 = readFloat(input);
			float mixShearY2 = readFloat(input);
			switch (readSByte(input)) {
				case CURVE_STEPPED:
					timeline->setStepped(frame);
					break;
				case CURVE_BEZIER:
					setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
					setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
					setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
					setBezier(input, timeline, bezier++, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
					setBezier(input, timeline, bezier++, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
					setBezier(input, timeline, bezier++, frame, 5, time, time2, mixShearY, mixShearY2, 1);
			}
			time = time2;
			mixRotate = mixRotate2;
			mixX = mixX2;
			mixY = mixY2;
			mixScaleX = mixScaleX2;
			mixScaleY = mixScaleY2;
			mixShearY = mixShearY2;
		}
		timelines.add(timeline);
	}

	// Path constraint timelines.
	for (int i = 0, n = readVarint(input, true); i < n; ++i) {
		int index = readVarint(input, true);
		PathConstraintData *data = skeletonData->_pathConstraints[index];
		for (int ii = 0, nn = readVarint(input, true); ii < nn; ii++) {
			int type = readByte(input);
			int frameCount = readVarint(input, true);
			int bezierCount = readVarint(input, true);
			switch (type) {
				case PATH_POSITION: {
					readTimeline(input, timelines, new PathConstraintPositionTimeline(frameCount, bezierCount, index),
								 data->_positionMode == PositionMode_Fixed ? scale : 1);
					break;
				}
				case PATH_SPACING: {
					readTimeline(input, timelines,
								 new PathConstraintSpacingTimeline(frameCount,
																   bezierCount,
																   index),
								 data->_spacingMode == SpacingMode_Length ||
												 data->_spacingMode == SpacingMode_Fixed
										 ? scale
										 : 1);
					break;
				}
				case PATH_MIX:
					PathConstraintMixTimeline *timeline = new PathConstraintMixTimeline(frameCount, bezierCount, index);
					float time = readFloat(input);
					float mixRotate = readFloat(input);
					float mixX = readFloat(input);
					float mixY = readFloat(input);
					for (int frame = 0, bezier = 0, frameLast = (int) timeline->getFrameCount() - 1;; frame++) {
						timeline->setFrame(frame, time, mixRotate, mixX, mixY);
						if (frame == frameLast) break;
						float time2 = readFloat(input);
						float mixRotate2 = readFloat(input);
						float mixX2 = readFloat(input);
						float mixY2 = readFloat(input);
						switch (readSByte(input)) {
							case CURVE_STEPPED:
								timeline->setStepped(frame);
								break;
							case CURVE_BEZIER:
								setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
								setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
								setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
						}
						time = time2;
						mixRotate = mixRotate2;
						mixX = mixX2;
						mixY = mixY2;
					}
					timelines.add(timeline);
			}
		}
	}

	// Physics timelines.
	for (int i = 0, n = readVarint(input, true); i < n; i++) {
		int index = readVarint(input, true) - 1;
		for (int ii = 0, nn = readVarint(input, true); ii < nn; ii++) {
			int type = readByte(input);
			int frameCount = readVarint(input, true);
			if (type == PHYSICS_RESET) {
				PhysicsConstraintResetTimeline *timeline = new (__FILE__, __LINE__) PhysicsConstraintResetTimeline(frameCount, index);
				for (int frame = 0; frame < frameCount; frame++)
					timeline->setFrame(frame, readFloat(input));
				timelines.add(timeline);
				continue;
			}
			int bezierCount = readVarint(input, true);
			switch (type) {
				case PHYSICS_INERTIA:
					readTimeline(input, timelines, new PhysicsConstraintInertiaTimeline(frameCount, bezierCount, index), 1);
					break;
				case PHYSICS_STRENGTH:
					readTimeline(input, timelines, new PhysicsConstraintStrengthTimeline(frameCount, bezierCount, index), 1);
					break;
				case PHYSICS_DAMPING:
					readTimeline(input, timelines, new PhysicsConstraintDampingTimeline(frameCount, bezierCount, index), 1);
					break;
				case PHYSICS_MASS:
					readTimeline(input, timelines, new PhysicsConstraintMassTimeline(frameCount, bezierCount, index), 1);
					break;
				case PHYSICS_WIND:
					readTimeline(input, timelines, new PhysicsConstraintWindTimeline(frameCount, bezierCount, index), 1);
					break;
				case PHYSICS_GRAVITY:
					readTimeline(input, timelines, new PhysicsConstraintGravityTimeline(frameCount, bezierCount, index), 1);
					break;
				case PHYSICS_MIX:
					readTimeline(input, timelines, new PhysicsConstraintMixTimeline(frameCount, bezierCount, index), 1);
			}
		}
	}

	// Attachment timelines.
	for (int i = 0, n = readVarint(input, true); i < n; ++i) {
		Skin *skin = skeletonData->_skins[readVarint(input, true)];
		for (int ii = 0, nn = readVarint(input, true); ii < nn; ++ii) {
			int slotIndex = readVarint(input, true);
			for (int iii = 0, nnn = readVarint(input, true); iii < nnn; iii++) {
				const char *attachmentName = readStringRef(input, skeletonData);
				Attachment *baseAttachment = skin->getAttachment(slotIndex, String(attachmentName));
				if (!baseAttachment) {
					ContainerUtil::cleanUpVectorOfPointers(timelines);
					setError("Attachment not found: ", attachmentName);
					return NULL;
				}
				unsigned int timelineType = readByte(input);
				int frameCount = readVarint(input, true);
				int frameLast = frameCount - 1;

				switch (timelineType) {
					case ATTACHMENT_DEFORM: {
						VertexAttachment *attachment = static_cast<VertexAttachment *>(baseAttachment);
						bool weighted = attachment->_bones.size() > 0;
						Vector<float> &vertices = attachment->_vertices;
						int deformLength = weighted ? (int) vertices.size() / 3 * 2 : (int) vertices.size();

						int bezierCount = readVarint(input, true);
						DeformTimeline *timeline = new (__FILE__, __LINE__) DeformTimeline(frameCount, bezierCount, slotIndex,
																						   attachment);

						float time = readFloat(input);
						for (int frame = 0, bezier = 0;; ++frame) {
							Vector<float> deform;
							size_t end = (size_t) readVarint(input, true);
							if (end == 0) {
								if (weighted) {
									deform.setSize(deformLength, 0);
									for (int iiii = 0; iiii < deformLength; ++iiii)
										deform[iiii] = 0;
								} else {
									deform.clearAndAddAll(vertices);
								}
							} else {
								deform.setSize(deformLength, 0);
								size_t start = (size_t) readVarint(input, true);
								end += start;
								if (scale == 1) {
									for (size_t v = start; v < end; ++v)
										deform[v] = readFloat(input);
								} else {
									for (size_t v = start; v < end; ++v)
										deform[v] = readFloat(input) * scale;
								}

								if (!weighted) {
									for (size_t v = 0, vn = deform.size(); v < vn; ++v)
										deform[v] += vertices[v];
								}
							}

							timeline->setFrame(frame, time, deform);
							if (frame == frameLast) break;
							float time2 = readFloat(input);
							switch (readSByte(input)) {
								case CURVE_STEPPED:
									timeline->setStepped(frame);
									break;
								case CURVE_BEZIER:
									setBezier(input, timeline, bezier++, frame, 0, time, time2, 0, 1, 1);
							}
							time = time2;
						}

						timelines.add(timeline);
						break;
					}
					case ATTACHMENT_SEQUENCE: {
						SequenceTimeline *timeline = new (__FILE__, __LINE__) SequenceTimeline(frameCount, slotIndex, baseAttachment);
						for (int frame = 0; frame < frameCount; frame++) {
							float time = readFloat(input);
							int modeAndIndex = readInt(input);
							float delay = readFloat(input);
							timeline->setFrame(frame, time, (spine::SequenceMode)(modeAndIndex & 0xf), modeAndIndex >> 4, delay);
						}
						timelines.add(timeline);
						break;
					}
				}
			}
		}
	}

	// Draw order timeline.
	size_t drawOrderCount = (size_t) readVarint(input, true);
	if (drawOrderCount > 0) {
		DrawOrderTimeline *timeline = new (__FILE__, __LINE__) DrawOrderTimeline(drawOrderCount);

		size_t slotCount = skeletonData->_slots.size();
		for (size_t i = 0; i < drawOrderCount; ++i) {
			float time = readFloat(input);
			size_t offsetCount = (size_t) readVarint(input, true);

			Vector<int> drawOrder;
			drawOrder.setSize(slotCount, 0);
			for (int ii = (int) slotCount - 1; ii >= 0; --ii)
				drawOrder[ii] = -1;

			Vector<int> unchanged;
			unchanged.setSize(slotCount - offsetCount, 0);
			size_t originalIndex = 0, unchangedIndex = 0;
			for (size_t ii = 0; ii < offsetCount; ++ii) {
				size_t slotIndex = (size_t) readVarint(input, true);
				// Collect unchanged items.
				while (originalIndex != slotIndex)
					unchanged[unchangedIndex++] = (int) originalIndex++;
				// Set changed items.
				size_t index = originalIndex;
				drawOrder[index + (size_t) readVarint(input, true)] = (int) originalIndex++;
			}

			// Collect remaining unchanged items.
			while (originalIndex < slotCount) {
				unchanged[unchangedIndex++] = (int) originalIndex++;
			}

			// Fill in unchanged items.
			for (int ii = (int) slotCount - 1; ii >= 0; --ii)
				if (drawOrder[ii] == -1) drawOrder[ii] = unchanged[--unchangedIndex];
			timeline->setFrame(i, time, drawOrder);
		}
		timelines.add(timeline);
	}

	// Event timeline.
	int eventCount = readVarint(input, true);
	if (eventCount > 0) {
		EventTimeline *timeline = new (__FILE__, __LINE__) EventTimeline(eventCount);

		for (int i = 0; i < eventCount; ++i) {
			float time = readFloat(input);
			EventData *eventData = skeletonData->_events[readVarint(input, true)];
			Event *event = new (__FILE__, __LINE__) Event(time, *eventData);

			event->_intValue = readVarint(input, false);
			event->_floatValue = readFloat(input);
			const char *event_stringValue = readString(input);
			if (event_stringValue == nullptr) {
				event->_stringValue = eventData->_stringValue;
			} else {
				event->_stringValue = String(event_stringValue);
				SpineExtension::free(event_stringValue, __FILE__, __LINE__);
			}

			if (!eventData->_audioPath.isEmpty()) {
				event->_volume = readFloat(input);
				event->_balance = readFloat(input);
			}
			timeline->setFrame(i, event);
		}
		timelines.add(timeline);
	}

	float duration = 0;
	for (int i = 0, n = (int) timelines.size(); i < n; i++) {
		duration = MathUtil::max(duration, (timelines[i])->getDuration());
	}
	return new (__FILE__, __LINE__) Animation(String(name), timelines, duration);
}
