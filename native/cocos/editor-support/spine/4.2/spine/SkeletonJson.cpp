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

#include <spine/SkeletonJson.h>

#include <spine/Atlas.h>
#include <spine/AtlasAttachmentLoader.h>
#include <spine/CurveTimeline.h>
#include <spine/Json.h>
#include <spine/LinkedMesh.h>
#include <spine/SkeletonData.h>
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
#include <spine/Skin.h>
#include <spine/SlotData.h>
#include <spine/TransformConstraintData.h>
#include <spine/TransformConstraintTimeline.h>
#include <spine/TranslateTimeline.h>
#include <spine/Vertices.h>
#include <spine/SequenceTimeline.h>
#include <spine/Version.h>

using namespace spine;

static float toColor(const char *value, size_t index) {
	char digits[3];
	char *error;
	int color;

	if (index >= strlen(value) / 2) return -1;

	value += index * 2;

	digits[0] = *value;
	digits[1] = *(value + 1);
	digits[2] = '\0';
	color = (int) strtoul(digits, &error, 16);
	if (*error != 0) return -1;

	return color / (float) 255;
}

static void toColor(Color &color, const char *value, bool hasAlpha) {
	color.r = toColor(value, 0);
	color.g = toColor(value, 1);
	color.b = toColor(value, 2);
	if (hasAlpha) color.a = toColor(value, 3);
}

SkeletonJson::SkeletonJson(Atlas *atlas) : _attachmentLoader(new (__FILE__, __LINE__) AtlasAttachmentLoader(atlas)),
										   _scale(1), _ownsLoader(true) {}

SkeletonJson::SkeletonJson(AttachmentLoader *attachmentLoader, bool ownsLoader) : _attachmentLoader(attachmentLoader),
																				  _scale(1),
																				  _ownsLoader(ownsLoader) {
	assert(_attachmentLoader != NULL);
}

SkeletonJson::~SkeletonJson() {
	ContainerUtil::cleanUpVectorOfPointers(_linkedMeshes);

	if (_ownsLoader) delete _attachmentLoader;
}

SkeletonData *SkeletonJson::readSkeletonDataFile(const String &path) {
	int length;
	SkeletonData *skeletonData;
	const char *json = SpineExtension::readFile(path, &length);
	if (length == 0 || !json) {
		setError(NULL, "Unable to read skeleton file: ", path);
		return NULL;
	}

	skeletonData = readSkeletonData(json);

	SpineExtension::free(json, __FILE__, __LINE__);

	return skeletonData;
}

SkeletonData *SkeletonJson::readSkeletonData(const char *json) {
	int i, ii;
	SkeletonData *skeletonData;
	Json *root, *skeleton, *bones, *boneMap, *ik, *transform, *path, *physics, *slots, *skins, *animations, *events;

	_error = "";
	_linkedMeshes.clear();

	root = new (__FILE__, __LINE__) Json(json);

	if (!root) {
		setError(NULL, "Invalid skeleton JSON: ", Json::getError());
		return NULL;
	}

	skeletonData = new (__FILE__, __LINE__) SkeletonData();

	skeleton = Json::getItem(root, "skeleton");
	if (skeleton) {
		skeletonData->_hash = Json::getString(skeleton, "hash", 0);
		skeletonData->_version = Json::getString(skeleton, "spine", 0);
		if (!skeletonData->_version.startsWith(SPINE_VERSION_STRING)) {
			char errorMsg[255];
			snprintf(errorMsg, 255, "Skeleton version %s does not match runtime version %s", skeletonData->_version.buffer(), SPINE_VERSION_STRING);
			delete skeletonData;
			setError(NULL, errorMsg, "");
			return NULL;
		}
		skeletonData->_x = Json::getFloat(skeleton, "x", 0);
		skeletonData->_y = Json::getFloat(skeleton, "y", 0);
		skeletonData->_width = Json::getFloat(skeleton, "width", 0);
		skeletonData->_height = Json::getFloat(skeleton, "height", 0);
		skeletonData->_referenceScale = Json::getFloat(skeleton, "referenceScale", 100) * _scale;
		skeletonData->_fps = Json::getFloat(skeleton, "fps", 30);
		skeletonData->_audioPath = Json::getString(skeleton, "audio", 0);
		skeletonData->_imagesPath = Json::getString(skeleton, "images", 0);
	}

	/* Bones. */
	bones = Json::getItem(root, "bones");
	skeletonData->_bones.setSize(bones->_size, 0);
	int bonesCount = 0;
	for (boneMap = bones->_child, i = 0; boneMap; boneMap = boneMap->_next, ++i) {
		BoneData *data;
		const char *inherit;

		BoneData *parent = 0;
		const char *parentName = Json::getString(boneMap, "parent", 0);
		if (parentName) {
			parent = skeletonData->findBone(parentName);
			if (!parent) {
				delete skeletonData;
				setError(root, "Parent bone not found: ", parentName);
				return NULL;
			}
		}

		data = new (__FILE__, __LINE__) BoneData(bonesCount, Json::getString(boneMap, "name", 0), parent);

		data->_length = Json::getFloat(boneMap, "length", 0) * _scale;
		data->_x = Json::getFloat(boneMap, "x", 0) * _scale;
		data->_y = Json::getFloat(boneMap, "y", 0) * _scale;
		data->_rotation = Json::getFloat(boneMap, "rotation", 0);
		data->_scaleX = Json::getFloat(boneMap, "scaleX", 1);
		data->_scaleY = Json::getFloat(boneMap, "scaleY", 1);
		data->_shearX = Json::getFloat(boneMap, "shearX", 0);
		data->_shearY = Json::getFloat(boneMap, "shearY", 0);
		inherit = Json::getString(boneMap, "inherit", "normal");
		data->_inherit = Inherit_Normal;
		if (strcmp(inherit, "normal") == 0) data->_inherit = Inherit_Normal;
		else if (strcmp(inherit, "onlyTranslation") == 0)
			data->_inherit = Inherit_OnlyTranslation;
		else if (strcmp(inherit, "noRotationOrReflection") == 0)
			data->_inherit = Inherit_NoRotationOrReflection;
		else if (strcmp(inherit, "noScale") == 0)
			data->_inherit = Inherit_NoScale;
		else if (strcmp(inherit, "noScaleOrReflection") == 0)
			data->_inherit = Inherit_NoScaleOrReflection;
		data->_skinRequired = Json::getBoolean(boneMap, "skin", false);

		const char *color = Json::getString(boneMap, "color", NULL);
		if (color) toColor(data->getColor(), color, true);

		data->_icon = Json::getString(boneMap, "icon", "");
		data->_visible = Json::getBoolean(boneMap, "visible", true);

		skeletonData->_bones[i] = data;
		bonesCount++;
	}

	/* Slots. */
	slots = Json::getItem(root, "slots");
	if (slots) {
		Json *slotMap;
		skeletonData->_slots.ensureCapacity(slots->_size);
		skeletonData->_slots.setSize(slots->_size, 0);
		for (slotMap = slots->_child, i = 0; slotMap; slotMap = slotMap->_next, ++i) {
			SlotData *data;
			const char *color;
			const char *dark;
			Json *item;

			const char *boneName = Json::getString(slotMap, "bone", 0);
			BoneData *boneData = skeletonData->findBone(boneName);
			if (!boneData) {
				delete skeletonData;
				setError(root, "Slot bone not found: ", boneName);
				return NULL;
			}

			String slotName = String(Json::getString(slotMap, "name", 0));
			data = new (__FILE__, __LINE__) SlotData(i, slotName, *boneData);

			color = Json::getString(slotMap, "color", 0);
			if (color) {
				Color &c = data->getColor();
				c.r = toColor(color, 0);
				c.g = toColor(color, 1);
				c.b = toColor(color, 2);
				c.a = toColor(color, 3);
			}

			dark = Json::getString(slotMap, "dark", 0);
			if (dark) {
				Color &darkColor = data->getDarkColor();
				darkColor.r = toColor(dark, 0);
				darkColor.g = toColor(dark, 1);
				darkColor.b = toColor(dark, 2);
				darkColor.a = 1;
				data->setHasDarkColor(true);
			}

			item = Json::getItem(slotMap, "attachment");
			if (item) data->setAttachmentName(item->_valueString);

			item = Json::getItem(slotMap, "blend");
			if (item) {
				if (strcmp(item->_valueString, "additive") == 0) data->_blendMode = BlendMode_Additive;
				else if (strcmp(item->_valueString, "multiply") == 0)
					data->_blendMode = BlendMode_Multiply;
				else if (strcmp(item->_valueString, "screen") == 0)
					data->_blendMode = BlendMode_Screen;
			}
			data->_visible = Json::getBoolean(slotMap, "visible", true);
			skeletonData->_slots[i] = data;
		}
	}

	/* IK constraints. */
	ik = Json::getItem(root, "ik");
	if (ik) {
		Json *constraintMap;
		skeletonData->_ikConstraints.ensureCapacity(ik->_size);
		skeletonData->_ikConstraints.setSize(ik->_size, 0);
		for (constraintMap = ik->_child, i = 0; constraintMap; constraintMap = constraintMap->_next, ++i) {
			const char *targetName;

			IkConstraintData *data = new (__FILE__, __LINE__) IkConstraintData(
					Json::getString(constraintMap, "name", 0));
			data->setOrder(Json::getInt(constraintMap, "order", 0));
			data->setSkinRequired(Json::getBoolean(constraintMap, "skin", false));

			boneMap = Json::getItem(constraintMap, "bones");
			data->_bones.ensureCapacity(boneMap->_size);
			data->_bones.setSize(boneMap->_size, 0);
			for (boneMap = boneMap->_child, ii = 0; boneMap; boneMap = boneMap->_next, ++ii) {
				data->_bones[ii] = skeletonData->findBone(boneMap->_valueString);
				if (!data->_bones[ii]) {
					delete skeletonData;
					setError(root, "IK bone not found: ", boneMap->_valueString);
					return NULL;
				}
			}

			targetName = Json::getString(constraintMap, "target", 0);
			data->_target = skeletonData->findBone(targetName);
			if (!data->_target) {
				delete skeletonData;
				setError(root, "Target bone not found: ", targetName);
				return NULL;
			}

			data->_mix = Json::getFloat(constraintMap, "mix", 1);
			data->_softness = Json::getFloat(constraintMap, "softness", 0) * _scale;
			data->_bendDirection = Json::getInt(constraintMap, "bendPositive", 1) ? 1 : -1;
			data->_compress = Json::getInt(constraintMap, "compress", 0) ? true : false;
			data->_stretch = Json::getInt(constraintMap, "stretch", 0) ? true : false;
			data->_uniform = Json::getInt(constraintMap, "uniform", 0) ? true : false;

			skeletonData->_ikConstraints[i] = data;
		}
	}

	/* Transform constraints. */
	transform = Json::getItem(root, "transform");
	if (transform) {
		Json *constraintMap;
		skeletonData->_transformConstraints.ensureCapacity(transform->_size);
		skeletonData->_transformConstraints.setSize(transform->_size, 0);
		for (constraintMap = transform->_child, i = 0; constraintMap; constraintMap = constraintMap->_next, ++i) {
			const char *name;

			TransformConstraintData *data = new (__FILE__, __LINE__) TransformConstraintData(
					Json::getString(constraintMap, "name", 0));
			data->setOrder(Json::getInt(constraintMap, "order", 0));
			data->setSkinRequired(Json::getBoolean(constraintMap, "skin", false));

			boneMap = Json::getItem(constraintMap, "bones");
			data->_bones.ensureCapacity(boneMap->_size);
			data->_bones.setSize(boneMap->_size, 0);
			for (boneMap = boneMap->_child, ii = 0; boneMap; boneMap = boneMap->_next, ++ii) {
				data->_bones[ii] = skeletonData->findBone(boneMap->_valueString);
				if (!data->_bones[ii]) {
					delete skeletonData;
					setError(root, "Transform bone not found: ", boneMap->_valueString);
					return NULL;
				}
			}

			name = Json::getString(constraintMap, "target", 0);
			data->_target = skeletonData->findBone(name);
			if (!data->_target) {
				delete skeletonData;
				setError(root, "Target bone not found: ", name);
				return NULL;
			}

			data->_local = Json::getInt(constraintMap, "local", 0) ? true : false;
			data->_relative = Json::getInt(constraintMap, "relative", 0) ? true : false;
			data->_offsetRotation = Json::getFloat(constraintMap, "rotation", 0);
			data->_offsetX = Json::getFloat(constraintMap, "x", 0) * _scale;
			data->_offsetY = Json::getFloat(constraintMap, "y", 0) * _scale;
			data->_offsetScaleX = Json::getFloat(constraintMap, "scaleX", 0);
			data->_offsetScaleY = Json::getFloat(constraintMap, "scaleY", 0);
			data->_offsetShearY = Json::getFloat(constraintMap, "shearY", 0);

			data->_mixRotate = Json::getFloat(constraintMap, "mixRotate", 1);
			data->_mixX = Json::getFloat(constraintMap, "mixX", 1);
			data->_mixY = Json::getFloat(constraintMap, "mixY", data->_mixX);
			data->_mixScaleX = Json::getFloat(constraintMap, "mixScaleX", 1);
			data->_mixScaleY = Json::getFloat(constraintMap, "mixScaleY", data->_mixScaleX);
			data->_mixShearY = Json::getFloat(constraintMap, "mixShearY", 1);

			skeletonData->_transformConstraints[i] = data;
		}
	}

	/* Path constraints */
	path = Json::getItem(root, "path");
	if (path) {
		Json *constraintMap;
		skeletonData->_pathConstraints.ensureCapacity(path->_size);
		skeletonData->_pathConstraints.setSize(path->_size, 0);
		for (constraintMap = path->_child, i = 0; constraintMap; constraintMap = constraintMap->_next, ++i) {
			const char *name;
			const char *item;

			PathConstraintData *data = new (__FILE__, __LINE__) PathConstraintData(
					Json::getString(constraintMap, "name", 0));
			data->setOrder(Json::getInt(constraintMap, "order", 0));
			data->setSkinRequired(Json::getBoolean(constraintMap, "skin", false));

			boneMap = Json::getItem(constraintMap, "bones");
			data->_bones.ensureCapacity(boneMap->_size);
			data->_bones.setSize(boneMap->_size, 0);
			for (boneMap = boneMap->_child, ii = 0; boneMap; boneMap = boneMap->_next, ++ii) {
				data->_bones[ii] = skeletonData->findBone(boneMap->_valueString);
				if (!data->_bones[ii]) {
					delete skeletonData;
					setError(root, "Path bone not found: ", boneMap->_valueString);
					return NULL;
				}
			}

			name = Json::getString(constraintMap, "target", 0);
			data->_target = skeletonData->findSlot(name);
			if (!data->_target) {
				delete skeletonData;
				setError(root, "Target slot not found: ", name);
				return NULL;
			}

			item = Json::getString(constraintMap, "positionMode", "percent");
			if (strcmp(item, "fixed") == 0) {
				data->_positionMode = PositionMode_Fixed;
			} else if (strcmp(item, "percent") == 0) {
				data->_positionMode = PositionMode_Percent;
			}

			item = Json::getString(constraintMap, "spacingMode", "length");
			if (strcmp(item, "length") == 0) data->_spacingMode = SpacingMode_Length;
			else if (strcmp(item, "fixed") == 0)
				data->_spacingMode = SpacingMode_Fixed;
			else if (strcmp(item, "percent") == 0)
				data->_spacingMode = SpacingMode_Percent;
			else
				data->_spacingMode = SpacingMode_Proportional;

			item = Json::getString(constraintMap, "rotateMode", "tangent");
			if (strcmp(item, "tangent") == 0) data->_rotateMode = RotateMode_Tangent;
			else if (strcmp(item, "chain") == 0)
				data->_rotateMode = RotateMode_Chain;
			else if (strcmp(item, "chainScale") == 0)
				data->_rotateMode = RotateMode_ChainScale;

			data->_offsetRotation = Json::getFloat(constraintMap, "rotation", 0);
			data->_position = Json::getFloat(constraintMap, "position", 0);
			if (data->_positionMode == PositionMode_Fixed) data->_position *= _scale;
			data->_spacing = Json::getFloat(constraintMap, "spacing", 0);
			if (data->_spacingMode == SpacingMode_Length || data->_spacingMode == SpacingMode_Fixed)
				data->_spacing *= _scale;
			data->_mixRotate = Json::getFloat(constraintMap, "mixRotate", 1);
			data->_mixX = Json::getFloat(constraintMap, "mixX", 1);
			data->_mixY = Json::getFloat(constraintMap, "mixY", data->_mixX);

			skeletonData->_pathConstraints[i] = data;
		}
	}

	/* Physics constraints */
	physics = Json::getItem(root, "physics");
	if (physics) {
		Json *constraintMap;
		skeletonData->_physicsConstraints.ensureCapacity(physics->_size);
		skeletonData->_physicsConstraints.setSize(physics->_size, 0);
		for (constraintMap = physics->_child, i = 0; constraintMap; constraintMap = constraintMap->_next, ++i) {
			const char *name;

			PhysicsConstraintData *data = new (__FILE__, __LINE__) PhysicsConstraintData(
					Json::getString(constraintMap, "name", 0));
			data->setOrder(Json::getInt(constraintMap, "order", 0));
			data->setSkinRequired(Json::getBoolean(constraintMap, "skin", false));

			name = Json::getString(constraintMap, "bone", 0);
			data->_bone = skeletonData->findBone(name);
			if (!data->_bone) {
				delete skeletonData;
				setError(root, "Physics bone not found: ", name);
				return NULL;
			}

			data->_x = Json::getFloat(constraintMap, "x", 0);
			data->_y = Json::getFloat(constraintMap, "y", 0);
			data->_rotate = Json::getFloat(constraintMap, "rotate", 0);
			data->_scaleX = Json::getFloat(constraintMap, "scaleX", 0);
			data->_shearX = Json::getFloat(constraintMap, "shearX", 0);
			data->_limit = Json::getFloat(constraintMap, "limit", 5000) * _scale;
			data->_step = 1.0f / Json::getInt(constraintMap, "fps", 60);
			data->_inertia = Json::getFloat(constraintMap, "inertia", 1);
			data->_strength = Json::getFloat(constraintMap, "strength", 100);
			data->_damping = Json::getFloat(constraintMap, "damping", 1);
			data->_massInverse = 1.0f / Json::getFloat(constraintMap, "mass", 1);
			data->_wind = Json::getFloat(constraintMap, "wind", 0);
			data->_gravity = Json::getFloat(constraintMap, "gravity", 0);
			data->_mix = Json::getFloat(constraintMap, "mix", 1);
			data->_inertiaGlobal = Json::getBoolean(constraintMap, "inertiaGlobal", false);
			data->_strengthGlobal = Json::getBoolean(constraintMap, "strengthGlobal", false);
			data->_dampingGlobal = Json::getBoolean(constraintMap, "dampingGlobal", false);
			data->_massGlobal = Json::getBoolean(constraintMap, "massGlobal", false);
			data->_windGlobal = Json::getBoolean(constraintMap, "windGlobal", false);
			data->_gravityGlobal = Json::getBoolean(constraintMap, "gravityGlobal", false);
			data->_mixGlobal = Json::getBoolean(constraintMap, "mixGlobal", false);

			skeletonData->_physicsConstraints[i] = data;
		}
	}

	/* Skins. */
	skins = Json::getItem(root, "skins");
	if (skins) {
		Json *skinMap;
		skeletonData->_skins.ensureCapacity(skins->_size);
		skeletonData->_skins.setSize(skins->_size, 0);
		int skinsIndex = 0;
		for (skinMap = skins->_child, i = 0; skinMap; skinMap = skinMap->_next, ++i) {
			Json *attachmentsMap;
			Json *curves;

			Skin *skin = new (__FILE__, __LINE__) Skin(Json::getString(skinMap, "name", ""));

			Json *item = Json::getItem(skinMap, "bones");
			if (item) {
				for (item = item->_child; item; item = item->_next) {
					BoneData *data = skeletonData->findBone(item->_valueString);
					if (!data) {
						delete skeletonData;
						setError(root, String("Skin bone not found: "), item->_valueString);
						return NULL;
					}
					skin->getBones().add(data);
				}
			}

			item = Json::getItem(skinMap, "ik");
			if (item) {
				for (item = item->_child; item; item = item->_next) {
					IkConstraintData *data = skeletonData->findIkConstraint(item->_valueString);
					if (!data) {
						delete skeletonData;
						setError(root, String("Skin IK constraint not found: "), item->_valueString);
						return NULL;
					}
					skin->getConstraints().add(data);
				}
			}

			item = Json::getItem(skinMap, "transform");
			if (item) {
				for (item = item->_child; item; item = item->_next) {
					TransformConstraintData *data = skeletonData->findTransformConstraint(item->_valueString);
					if (!data) {
						delete skeletonData;
						setError(root, String("Skin transform constraint not found: "), item->_valueString);
						return NULL;
					}
					skin->getConstraints().add(data);
				}
			}

			item = Json::getItem(skinMap, "path");
			if (item) {
				for (item = item->_child; item; item = item->_next) {
					PathConstraintData *data = skeletonData->findPathConstraint(item->_valueString);
					if (!data) {
						delete skeletonData;
						setError(root, String("Skin path constraint not found: "), item->_valueString);
						return NULL;
					}
					skin->getConstraints().add(data);
				}
			}

			item = Json::getItem(skinMap, "physics");
			if (item) {
				for (item = item->_child; item; item = item->_next) {
					PhysicsConstraintData *data = skeletonData->findPhysicsConstraint(item->_valueString);
					if (!data) {
						delete skeletonData;
						setError(root, String("Skin physics constraint not found: "), item->_valueString);
						return NULL;
					}
					skin->getConstraints().add(data);
				}
			}

			skeletonData->_skins[skinsIndex++] = skin;
			if (strcmp(Json::getString(skinMap, "name", ""), "default") == 0) {
				skeletonData->_defaultSkin = skin;
			}

			Json *attachments = Json::getItem(skinMap, "attachments");
			if (attachments)
				for (attachmentsMap = attachments->_child;
					 attachmentsMap; attachmentsMap = attachmentsMap->_next) {
					SlotData *slot = skeletonData->findSlot(attachmentsMap->_name);
					Json *attachmentMap;

					for (attachmentMap = attachmentsMap->_child; attachmentMap; attachmentMap = attachmentMap->_next) {
						Attachment *attachment = NULL;
						const char *skinAttachmentName = attachmentMap->_name;
						const char *attachmentName = Json::getString(attachmentMap, "name", skinAttachmentName);
						const char *attachmentPath = Json::getString(attachmentMap, "path", attachmentName);
						const char *color;
						Json *entry;

						const char *typeString = Json::getString(attachmentMap, "type", "region");
						AttachmentType type;
						if (strcmp(typeString, "region") == 0) type = AttachmentType_Region;
						else if (strcmp(typeString, "mesh") == 0)
							type = AttachmentType_Mesh;
						else if (strcmp(typeString, "linkedmesh") == 0)
							type = AttachmentType_Linkedmesh;
						else if (strcmp(typeString, "boundingbox") == 0)
							type = AttachmentType_Boundingbox;
						else if (strcmp(typeString, "path") == 0)
							type = AttachmentType_Path;
						else if (strcmp(typeString, "clipping") == 0)
							type = AttachmentType_Clipping;
						else if (strcmp(typeString, "point") == 0)
							type = AttachmentType_Point;
						else {
							delete skeletonData;
							setError(root, "Unknown attachment type: ", typeString);
							return NULL;
						}

						switch (type) {
							case AttachmentType_Region: {
								Sequence *sequence = readSequence(Json::getItem(attachmentMap, "sequence"));
								attachment = _attachmentLoader->newRegionAttachment(*skin, attachmentName, attachmentPath, sequence);
								if (!attachment) {
									delete skeletonData;
									setError(root, "Error reading attachment: ", skinAttachmentName);
									return NULL;
								}

								RegionAttachment *region = static_cast<RegionAttachment *>(attachment);
								region->_path = attachmentPath;

								region->_x = Json::getFloat(attachmentMap, "x", 0) * _scale;
								region->_y = Json::getFloat(attachmentMap, "y", 0) * _scale;
								region->_scaleX = Json::getFloat(attachmentMap, "scaleX", 1);
								region->_scaleY = Json::getFloat(attachmentMap, "scaleY", 1);
								region->_rotation = Json::getFloat(attachmentMap, "rotation", 0);
								region->_width = Json::getFloat(attachmentMap, "width", 32) * _scale;
								region->_height = Json::getFloat(attachmentMap, "height", 32) * _scale;
								region->_sequence = sequence;

								color = Json::getString(attachmentMap, "color", 0);
								if (color) toColor(region->getColor(), color, true);

								if (region->_region != NULL) region->updateRegion();
								_attachmentLoader->configureAttachment(region);
								break;
							}
							case AttachmentType_Mesh:
							case AttachmentType_Linkedmesh: {
								Sequence *sequence = readSequence(Json::getItem(attachmentMap, "sequence"));
								attachment = _attachmentLoader->newMeshAttachment(*skin, attachmentName, attachmentPath, sequence);

								if (!attachment) {
									delete skeletonData;
									setError(root, "Error reading attachment: ", skinAttachmentName);
									return NULL;
								}

								MeshAttachment *mesh = static_cast<MeshAttachment *>(attachment);
								mesh->_path = attachmentPath;

								color = Json::getString(attachmentMap, "color", 0);
								if (color) toColor(mesh->getColor(), color, true);

								mesh->_width = Json::getFloat(attachmentMap, "width", 32) * _scale;
								mesh->_height = Json::getFloat(attachmentMap, "height", 32) * _scale;
								mesh->_sequence = sequence;

								entry = Json::getItem(attachmentMap, "parent");
								if (!entry) {
									int verticesLength;
									entry = Json::getItem(attachmentMap, "triangles");
									mesh->_triangles.ensureCapacity(entry->_size);
									mesh->_triangles.setSize(entry->_size, 0);
									for (entry = entry->_child, ii = 0; entry; entry = entry->_next, ++ii)
										mesh->_triangles[ii] = (unsigned short) entry->_valueInt;

									entry = Json::getItem(attachmentMap, "uvs");
									verticesLength = entry->_size;
									mesh->_regionUVs.ensureCapacity(verticesLength);
									mesh->_regionUVs.setSize(verticesLength, 0);
									for (entry = entry->_child, ii = 0; entry; entry = entry->_next, ++ii)
										mesh->_regionUVs[ii] = entry->_valueFloat;

									readVertices(attachmentMap, mesh, verticesLength);

									if (mesh->_region != NULL) mesh->updateRegion();

									mesh->_hullLength = Json::getInt(attachmentMap, "hull", 0);

									entry = Json::getItem(attachmentMap, "edges");
									if (entry) {
										mesh->_edges.ensureCapacity(entry->_size);
										mesh->_edges.setSize(entry->_size, 0);
										for (entry = entry->_child, ii = 0; entry; entry = entry->_next, ++ii)
											mesh->_edges[ii] = entry->_valueInt;
									}
									_attachmentLoader->configureAttachment(mesh);
								} else {
									bool inheritTimelines = Json::getInt(attachmentMap, "timelines", 1) ? true : false;
									LinkedMesh *linkedMesh = new (__FILE__, __LINE__) LinkedMesh(mesh,
																								 String(Json::getString(
																										 attachmentMap,
																										 "skin", 0)),
																								 slot->getIndex(),
																								 String(entry->_valueString),
																								 inheritTimelines);
									_linkedMeshes.add(linkedMesh);
								}
								break;
							}
							case AttachmentType_Boundingbox: {
								attachment = _attachmentLoader->newBoundingBoxAttachment(*skin, attachmentName);

								BoundingBoxAttachment *box = static_cast<BoundingBoxAttachment *>(attachment);

								int vertexCount = Json::getInt(attachmentMap, "vertexCount", 0) << 1;
								readVertices(attachmentMap, box, vertexCount);
								color = Json::getString(attachmentMap, "color", NULL);
								if (color) toColor(box->getColor(), color, true);
								_attachmentLoader->configureAttachment(attachment);
								break;
							}
							case AttachmentType_Path: {
								attachment = _attachmentLoader->newPathAttachment(*skin, attachmentName);

								PathAttachment *pathAttatchment = static_cast<PathAttachment *>(attachment);

								int vertexCount = 0;
								pathAttatchment->_closed = Json::getInt(attachmentMap, "closed", 0) ? true : false;
								pathAttatchment->_constantSpeed = Json::getInt(attachmentMap, "constantSpeed", 1) ? true
																												  : false;
								vertexCount = Json::getInt(attachmentMap, "vertexCount", 0);
								readVertices(attachmentMap, pathAttatchment, vertexCount << 1);

								pathAttatchment->_lengths.ensureCapacity(vertexCount / 3);
								pathAttatchment->_lengths.setSize(vertexCount / 3, 0);

								curves = Json::getItem(attachmentMap, "lengths");
								for (curves = curves->_child, ii = 0; curves; curves = curves->_next, ++ii)
									pathAttatchment->_lengths[ii] = curves->_valueFloat * _scale;
								color = Json::getString(attachmentMap, "color", NULL);
								if (color) toColor(pathAttatchment->getColor(), color, true);
								_attachmentLoader->configureAttachment(attachment);
								break;
							}
							case AttachmentType_Point: {
								attachment = _attachmentLoader->newPointAttachment(*skin, attachmentName);

								PointAttachment *point = static_cast<PointAttachment *>(attachment);

								point->_x = Json::getFloat(attachmentMap, "x", 0) * _scale;
								point->_y = Json::getFloat(attachmentMap, "y", 0) * _scale;
								point->_rotation = Json::getFloat(attachmentMap, "rotation", 0);
								color = Json::getString(attachmentMap, "color", NULL);
								if (color) toColor(point->getColor(), color, true);
								_attachmentLoader->configureAttachment(attachment);
								break;
							}
							case AttachmentType_Clipping: {
								attachment = _attachmentLoader->newClippingAttachment(*skin, attachmentName);

								ClippingAttachment *clip = static_cast<ClippingAttachment *>(attachment);

								int vertexCount = 0;
								const char *end = Json::getString(attachmentMap, "end", 0);
								if (end) clip->_endSlot = skeletonData->findSlot(end);
								vertexCount = Json::getInt(attachmentMap, "vertexCount", 0) << 1;
								readVertices(attachmentMap, clip, vertexCount);
								color = Json::getString(attachmentMap, "color", NULL);
								if (color) toColor(clip->getColor(), color, true);
								_attachmentLoader->configureAttachment(attachment);
								break;
							}
						}

						skin->setAttachment(slot->getIndex(), skinAttachmentName, attachment);
					}
				}
		}
	}

	/* Linked meshes. */
	int n = (int) _linkedMeshes.size();
	for (i = 0; i < n; ++i) {
		LinkedMesh *linkedMesh = _linkedMeshes[i];
		Skin *skin = linkedMesh->_skin.length() == 0 ? skeletonData->getDefaultSkin() : skeletonData->findSkin(linkedMesh->_skin);
		if (skin == NULL) {
			delete skeletonData;
			setError(root, "Skin not found: ", linkedMesh->_skin.buffer());
			return NULL;
		}
		Attachment *parent = skin->getAttachment(linkedMesh->_slotIndex, linkedMesh->_parent);
		if (parent == NULL) {
			delete skeletonData;
			setError(root, "Parent mesh not found: ", linkedMesh->_parent.buffer());
			return NULL;
		}
		linkedMesh->_mesh->_timelineAttachment = linkedMesh->_inheritTimeline ? static_cast<VertexAttachment *>(parent)
																			  : linkedMesh->_mesh;
		linkedMesh->_mesh->setParentMesh(static_cast<MeshAttachment *>(parent));
		if (linkedMesh->_mesh->_region != NULL) linkedMesh->_mesh->updateRegion();
		_attachmentLoader->configureAttachment(linkedMesh->_mesh);
	}
	ContainerUtil::cleanUpVectorOfPointers(_linkedMeshes);
	_linkedMeshes.clear();

	/* Events. */
	events = Json::getItem(root, "events");
	if (events) {
		Json *eventMap;
		skeletonData->_events.ensureCapacity(events->_size);
		skeletonData->_events.setSize(events->_size, 0);
		for (eventMap = events->_child, i = 0; eventMap; eventMap = eventMap->_next, ++i) {
			EventData *eventData = new (__FILE__, __LINE__) EventData(String(eventMap->_name));

			eventData->_intValue = Json::getInt(eventMap, "int", 0);
			eventData->_floatValue = Json::getFloat(eventMap, "float", 0);
			const char *stringValue = Json::getString(eventMap, "string", 0);
			eventData->_stringValue = stringValue;
			const char *audioPath = Json::getString(eventMap, "audio", 0);
			eventData->_audioPath = audioPath;
			if (audioPath) {
				eventData->_volume = Json::getFloat(eventMap, "volume", 1);
				eventData->_balance = Json::getFloat(eventMap, "balance", 0);
			}
			skeletonData->_events[i] = eventData;
		}
	}

	/* Animations. */
	animations = Json::getItem(root, "animations");
	if (animations) {
		Json *animationMap;
		skeletonData->_animations.ensureCapacity(animations->_size);
		skeletonData->_animations.setSize(animations->_size, 0);
		int animationsIndex = 0;
		for (animationMap = animations->_child; animationMap; animationMap = animationMap->_next) {
			Animation *animation = readAnimation(animationMap, skeletonData);
			if (!animation) {
				delete skeletonData;
				delete root;
				return NULL;
			}
			skeletonData->_animations[animationsIndex++] = animation;
		}
	}

	delete root;

	return skeletonData;
}

Sequence *SkeletonJson::readSequence(Json *item) {
	if (item == NULL) return NULL;
	Sequence *sequence = new Sequence(Json::getInt(item, "count", 0));
	sequence->_start = Json::getInt(item, "start", 1);
	sequence->_digits = Json::getInt(item, "digits", 0);
	sequence->_setupIndex = Json::getInt(item, "setupIndex", 0);
	return sequence;
}

void SkeletonJson::setBezier(CurveTimeline *timeline, int frame, int value, int bezier, float time1, float value1, float cx1,
							 float cy1,
							 float cx2, float cy2, float time2, float value2) {
	timeline->setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2);
}

int SkeletonJson::readCurve(Json *curve, CurveTimeline *timeline, int bezier, int frame, int value, float time1,
							float time2,
							float value1, float value2, float scale) {
	if (curve->_type == Json::JSON_STRING && strcmp(curve->_valueString, "stepped") == 0) {
		timeline->setStepped(frame);
		return bezier;
	}
	curve = Json::getItem(curve, value << 2);
	float cx1 = curve->_valueFloat;
	curve = curve->_next;
	float cy1 = curve->_valueFloat * scale;
	curve = curve->_next;
	float cx2 = curve->_valueFloat;
	curve = curve->_next;
	float cy2 = curve->_valueFloat * scale;
	setBezier(timeline, frame, value, bezier, time1, value1, cx1, cy1, cx2, cy2, time2, value2);
	return bezier + 1;
}

Timeline *SkeletonJson::readTimeline(Json *keyMap, CurveTimeline1 *timeline, float defaultValue, float scale) {
	float time = Json::getFloat(keyMap, "time", 0);
	float value = Json::getFloat(keyMap, "value", defaultValue) * scale;
	int bezier = 0;
	for (int frame = 0;; frame++) {
		timeline->setFrame(frame, time, value);
		Json *nextMap = keyMap->_next;
		if (!nextMap) break;
		float time2 = Json::getFloat(nextMap, "time", 0);
		float value2 = Json::getFloat(nextMap, "value", defaultValue) * scale;
		Json *curve = Json::getItem(keyMap, "curve");
		if (curve != NULL) bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, value, value2, scale);
		time = time2;
		value = value2;
		keyMap = nextMap;
	}
	// timeline.shrink(); // BOZO
	return timeline;
}

Timeline *SkeletonJson::readTimeline(Json *keyMap, CurveTimeline2 *timeline, const char *name1, const char *name2,
									 float defaultValue, float scale) {
	float time = Json::getFloat(keyMap, "time", 0);
	float value1 = Json::getFloat(keyMap, name1, defaultValue) * scale;
	float value2 = Json::getFloat(keyMap, name2, defaultValue) * scale;
	int bezier = 0;
	for (int frame = 0;; frame++) {
		timeline->setFrame(frame, time, value1, value2);
		Json *nextMap = keyMap->_next;
		if (!nextMap) break;
		float time2 = Json::getFloat(nextMap, "time", 0);
		float nvalue1 = Json::getFloat(nextMap, name1, defaultValue) * scale;
		float nvalue2 = Json::getFloat(nextMap, name2, defaultValue) * scale;
		Json *curve = Json::getItem(keyMap, "curve");
		if (curve != NULL) {
			bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, value1, nvalue1, scale);
			bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, value2, nvalue2, scale);
		}
		time = time2;
		value1 = nvalue1;
		value2 = nvalue2;
		keyMap = nextMap;
	}
	// timeline.shrink(); // BOZO
	return timeline;
}

int SkeletonJson::findSlotIndex(SkeletonData *skeletonData, const String &slotName, Vector<Timeline *> timelines) {
	int slotIndex = ContainerUtil::findIndexWithName(skeletonData->getSlots(), slotName);
	if (slotIndex == -1) {
		ContainerUtil::cleanUpVectorOfPointers(timelines);
		setError(NULL, "Slot not found: ", slotName);
	}
	return slotIndex;
}

Animation *SkeletonJson::readAnimation(Json *root, SkeletonData *skeletonData) {
	Vector<Timeline *> timelines;
	Json *bones = Json::getItem(root, "bones");
	Json *slots = Json::getItem(root, "slots");
	Json *ik = Json::getItem(root, "ik");
	Json *transform = Json::getItem(root, "transform");
	Json *paths = Json::getItem(root, "path");
	Json *physics = Json::getItem(root, "physics");
	Json *attachments = Json::getItem(root, "attachments");
	Json *drawOrder = Json::getItem(root, "drawOrder");
	Json *events = Json::getItem(root, "events");
	Json *boneMap, *slotMap, *keyMap, *nextMap, *curve;
	int frame, bezier;
	Color color, color2, newColor, newColor2;

	/** Slot timelines. */
	for (slotMap = slots ? slots->_child : 0; slotMap; slotMap = slotMap->_next) {
		int slotIndex = findSlotIndex(skeletonData, slotMap->_name, timelines);
		if (slotIndex == -1) return NULL;

		for (Json *timelineMap = slotMap->_child; timelineMap; timelineMap = timelineMap->_next) {
			int frames = timelineMap->_size;
			if (strcmp(timelineMap->_name, "attachment") == 0) {
				AttachmentTimeline *timeline = new (__FILE__, __LINE__) AttachmentTimeline(frames, slotIndex);
				for (keyMap = timelineMap->_child, frame = 0; keyMap; keyMap = keyMap->_next, ++frame) {
					timeline->setFrame(frame, Json::getFloat(keyMap, "time", 0),
									   Json::getItem(keyMap, "name") ? Json::getItem(keyMap, "name")->_valueString : NULL);
				}
				timelines.add(timeline);

			} else if (strcmp(timelineMap->_name, "rgba") == 0) {
				RGBATimeline *timeline = new (__FILE__, __LINE__) RGBATimeline(frames, frames << 2, slotIndex);
				keyMap = timelineMap->_child;
				float time = Json::getFloat(keyMap, "time", 0);
				toColor(color, Json::getString(keyMap, "color", 0), true);

				for (frame = 0, bezier = 0;; ++frame) {
					timeline->setFrame(frame, time, color.r, color.g, color.b, color.a);
					nextMap = keyMap->_next;
					if (!nextMap) {
						// timeline.shrink(); // BOZO
						break;
					}
					float time2 = Json::getFloat(nextMap, "time", 0);
					toColor(newColor, Json::getString(nextMap, "color", 0), true);
					curve = Json::getItem(keyMap, "curve");
					if (curve) {
						bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
					}
					time = time2;
					color = newColor;
					keyMap = nextMap;
				}
				timelines.add(timeline);
			} else if (strcmp(timelineMap->_name, "rgb") == 0) {
				RGBTimeline *timeline = new (__FILE__, __LINE__) RGBTimeline(frames, frames * 3, slotIndex);
				keyMap = timelineMap->_child;
				float time = Json::getFloat(keyMap, "time", 0);
				toColor(color, Json::getString(keyMap, "color", 0), false);

				for (frame = 0, bezier = 0;; ++frame) {
					timeline->setFrame(frame, time, color.r, color.g, color.b);
					nextMap = keyMap->_next;
					if (!nextMap) {
						// timeline.shrink(); // BOZO
						break;
					}
					float time2 = Json::getFloat(nextMap, "time", 0);
					toColor(newColor, Json::getString(nextMap, "color", 0), false);
					curve = Json::getItem(keyMap, "curve");
					if (curve) {
						bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
					}
					time = time2;
					color = newColor;
					keyMap = nextMap;
				}
				timelines.add(timeline);
			} else if (strcmp(timelineMap->_name, "alpha") == 0) {
				timelines.add(readTimeline(timelineMap->_child,
										   new (__FILE__, __LINE__) AlphaTimeline(frames, frames, slotIndex),
										   0, 1));
			} else if (strcmp(timelineMap->_name, "rgba2") == 0) {
				RGBA2Timeline *timeline = new (__FILE__, __LINE__) RGBA2Timeline(frames, frames * 7, slotIndex);
				keyMap = timelineMap->_child;
				float time = Json::getFloat(keyMap, "time", 0);
				toColor(color, Json::getString(keyMap, "light", 0), true);
				toColor(color2, Json::getString(keyMap, "dark", 0), false);

				for (frame = 0, bezier = 0;; ++frame) {
					timeline->setFrame(frame, time, color.r, color.g, color.b, color.a, color2.r, color2.g, color2.b);
					nextMap = keyMap->_next;
					if (!nextMap) {
						// timeline.shrink(); // BOZO
						break;
					}
					float time2 = Json::getFloat(nextMap, "time", 0);
					toColor(newColor, Json::getString(nextMap, "light", 0), true);
					toColor(newColor2, Json::getString(nextMap, "dark", 0), false);
					curve = Json::getItem(keyMap, "curve");
					if (curve) {
						bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.r, newColor2.r, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.g, newColor2.g, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 6, time, time2, color2.b, newColor2.b, 1);
					}
					time = time2;
					color = newColor;
					color2 = newColor2;
					keyMap = nextMap;
				}
				timelines.add(timeline);
			} else if (strcmp(timelineMap->_name, "rgb2") == 0) {
				RGBA2Timeline *timeline = new (__FILE__, __LINE__) RGBA2Timeline(frames, frames * 6, slotIndex);
				keyMap = timelineMap->_child;
				float time = Json::getFloat(keyMap, "time", 0);
				toColor(color, Json::getString(keyMap, "light", 0), false);
				toColor(color2, Json::getString(keyMap, "dark", 0), false);

				for (frame = 0, bezier = 0;; ++frame) {
					timeline->setFrame(frame, time, color.r, color.g, color.b, color.a, color2.r, color2.g, color2.b);
					nextMap = keyMap->_next;
					if (!nextMap) {
						// timeline.shrink(); // BOZO
						break;
					}
					float time2 = Json::getFloat(nextMap, "time", 0);
					toColor(newColor, Json::getString(nextMap, "light", 0), false);
					toColor(newColor2, Json::getString(nextMap, "dark", 0), false);
					curve = Json::getItem(keyMap, "curve");
					if (curve) {
						bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color2.r, newColor2.r, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.g, newColor2.g, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.b, newColor2.b, 1);
					}
					time = time2;
					color = newColor;
					color2 = newColor2;
					keyMap = nextMap;
				}
				timelines.add(timeline);
			} else {
				ContainerUtil::cleanUpVectorOfPointers(timelines);
				setError(NULL, "Invalid timeline type for a slot: ", timelineMap->_name);
				return NULL;
			}
		}
	}

	/** Bone timelines. */
	for (boneMap = bones ? bones->_child : 0; boneMap; boneMap = boneMap->_next) {
		int boneIndex = ContainerUtil::findIndexWithName(skeletonData->_bones, boneMap->_name);
		if (boneIndex == -1) {
			ContainerUtil::cleanUpVectorOfPointers(timelines);
			setError(NULL, "Bone not found: ", boneMap->_name);
			return NULL;
		}

		for (Json *timelineMap = boneMap->_child; timelineMap; timelineMap = timelineMap->_next) {
			int frames = timelineMap->_size;
			if (frames == 0) continue;

			if (strcmp(timelineMap->_name, "rotate") == 0) {
				timelines.add(readTimeline(timelineMap->_child,
										   new RotateTimeline(frames, frames, boneIndex), 0,
										   1));
			} else if (strcmp(timelineMap->_name, "translate") == 0) {
				TranslateTimeline *timeline = new TranslateTimeline(frames, frames << 1,
																	boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, "x", "y", 0, _scale));
			} else if (strcmp(timelineMap->_name, "translatex") == 0) {
				TranslateXTimeline *timeline = new TranslateXTimeline(frames, frames,
																	  boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, 0, _scale));
			} else if (strcmp(timelineMap->_name, "translatey") == 0) {
				TranslateYTimeline *timeline = new TranslateYTimeline(frames, frames,
																	  boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, 0, _scale));
			} else if (strcmp(timelineMap->_name, "scale") == 0) {
				ScaleTimeline *timeline = new (__FILE__, __LINE__) ScaleTimeline(frames,
																				 frames << 1, boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, "x", "y", 1, 1));
			} else if (strcmp(timelineMap->_name, "scalex") == 0) {
				ScaleXTimeline *timeline = new (__FILE__, __LINE__) ScaleXTimeline(frames,
																				   frames, boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, 1, 1));
			} else if (strcmp(timelineMap->_name, "scaley") == 0) {
				ScaleYTimeline *timeline = new (__FILE__, __LINE__) ScaleYTimeline(frames,
																				   frames, boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, 1, 1));
			} else if (strcmp(timelineMap->_name, "shear") == 0) {
				ShearTimeline *timeline = new (__FILE__, __LINE__) ShearTimeline(frames,
																				 frames << 1, boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, "x", "y", 0, 1));
			} else if (strcmp(timelineMap->_name, "shearx") == 0) {
				ShearXTimeline *timeline = new (__FILE__, __LINE__) ShearXTimeline(frames,
																				   frames, boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, 0, 1));
			} else if (strcmp(timelineMap->_name, "sheary") == 0) {
				ShearYTimeline *timeline = new (__FILE__, __LINE__) ShearYTimeline(frames,
																				   frames, boneIndex);
				timelines.add(readTimeline(timelineMap->_child, timeline, 0, 1));
			} else if (strcmp(timelineMap->_name, "inherit") == 0) {
				InheritTimeline *timeline = new (__FILE__, __LINE__) InheritTimeline(frames, boneIndex);
				keyMap = timelineMap->_child;
				for (frame = 0;; frame++) {
					float time = Json::getFloat(keyMap, "time", 0);
					const char *value = Json::getString(keyMap, "inherit", "normal");
					Inherit inherit = Inherit_Normal;
					if (strcmp(value, "normal") == 0) inherit = Inherit_Normal;
					else if (strcmp(value, "onlyTranslation") == 0)
						inherit = Inherit_OnlyTranslation;
					else if (strcmp(value, "noRotationOrReflection") == 0)
						inherit = Inherit_NoRotationOrReflection;
					else if (strcmp(value, "noScale") == 0)
						inherit = Inherit_NoScale;
					else if (strcmp(value, "noScaleOrReflection") == 0)
						inherit = Inherit_NoScaleOrReflection;
					timeline->setFrame(frame, time, inherit);
					nextMap = keyMap->_next;
					if (!nextMap) break;
					keyMap = nextMap;
				}
				timelines.add(timeline);
			} else {
				ContainerUtil::cleanUpVectorOfPointers(timelines);
				setError(NULL, "Invalid timeline type for a bone: ", timelineMap->_name);
				return NULL;
			}
		}
	}

	/** IK constraint timelines. */
	for (Json *constraintMap = ik ? ik->_child : 0; constraintMap; constraintMap = constraintMap->_next) {
		keyMap = constraintMap->_child;
		if (keyMap == NULL) continue;

		IkConstraintData *constraint = skeletonData->findIkConstraint(constraintMap->_name);
		int constraintIndex = skeletonData->_ikConstraints.indexOf(constraint);
		IkConstraintTimeline *timeline = new (__FILE__, __LINE__) IkConstraintTimeline(constraintMap->_size,
																					   constraintMap->_size << 1,
																					   constraintIndex);

		float time = Json::getFloat(keyMap, "time", 0);
		float mix = Json::getFloat(keyMap, "mix", 1);
		float softness = Json::getFloat(keyMap, "softness", 0) * _scale;

		for (frame = 0, bezier = 0;; frame++) {
			int bendDirection = Json::getBoolean(keyMap, "bendPositive", true) ? 1 : -1;
			timeline->setFrame(frame, time, mix, softness, bendDirection, Json::getBoolean(keyMap, "compress", false),
							   Json::getBoolean(keyMap, "stretch", false));
			nextMap = keyMap->_next;
			if (!nextMap) {
				// timeline.shrink(); // BOZO
				break;
			}

			float time2 = Json::getFloat(nextMap, "time", 0);
			float mix2 = Json::getFloat(nextMap, "mix", 1);
			float softness2 = Json::getFloat(nextMap, "softness", 0) * _scale;
			curve = Json::getItem(keyMap, "curve");
			if (curve) {
				bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mix, mix2, 1);
				bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, softness, softness2, _scale);
			}

			time = time2;
			mix = mix2;
			softness = softness2;
			keyMap = nextMap;
		}

		timelines.add(timeline);
	}

	/** Transform constraint timelines. */
	for (Json *constraintMap = transform ? transform->_child : 0; constraintMap; constraintMap = constraintMap->_next) {
		keyMap = constraintMap->_child;
		if (keyMap == NULL) continue;

		TransformConstraintData *constraint = skeletonData->findTransformConstraint(constraintMap->_name);
		int constraintIndex = skeletonData->_transformConstraints.indexOf(constraint);
		TransformConstraintTimeline *timeline = new (__FILE__, __LINE__) TransformConstraintTimeline(
				constraintMap->_size, constraintMap->_size * 6, constraintIndex);

		float time = Json::getFloat(keyMap, "time", 0);
		float mixRotate = Json::getFloat(keyMap, "mixRotate", 1);
		float mixShearY = Json::getFloat(keyMap, "mixShearY", 1);
		float mixX = Json::getFloat(keyMap, "mixX", 1);
		float mixY = Json::getFloat(keyMap, "mixY", mixX);
		float mixScaleX = Json::getFloat(keyMap, "mixScaleX", 1);
		float mixScaleY = Json::getFloat(keyMap, "mixScaleY", mixScaleX);

		for (frame = 0, bezier = 0;; frame++) {
			timeline->setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
			nextMap = keyMap->_next;
			if (!nextMap) {
				// timeline.shrink(); // BOZO
				break;
			}

			float time2 = Json::getFloat(nextMap, "time", 0);
			float mixRotate2 = Json::getFloat(nextMap, "mixRotate", 1);
			float mixShearY2 = Json::getFloat(nextMap, "mixShearY", 1);
			float mixX2 = Json::getFloat(nextMap, "mixX", 1);
			float mixY2 = Json::getFloat(nextMap, "mixY", mixX2);
			float mixScaleX2 = Json::getFloat(nextMap, "mixScaleX", 1);
			float mixScaleY2 = Json::getFloat(nextMap, "mixScaleY", mixScaleX2);
			curve = Json::getItem(keyMap, "curve");
			if (curve) {
				bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
				bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
				bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
				bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
				bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
				bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, mixShearY, mixShearY2, 1);
			}

			time = time2;
			mixRotate = mixRotate2;
			mixX = mixX2;
			mixY = mixY2;
			mixScaleX = mixScaleX2;
			mixScaleY = mixScaleY2;
			mixShearY = mixShearY2;
			keyMap = nextMap;
		}

		timelines.add(timeline);
	}

	/** Path constraint timelines. */
	for (Json *constraintMap = paths ? paths->_child : 0; constraintMap; constraintMap = constraintMap->_next) {
		PathConstraintData *constraint = skeletonData->findPathConstraint(constraintMap->_name);
		if (!constraint) {
			ContainerUtil::cleanUpVectorOfPointers(timelines);
			setError(NULL, "Path constraint not found: ", constraintMap->_name);
			return NULL;
		}
		int constraintIndex = skeletonData->_pathConstraints.indexOf(constraint);
		for (Json *timelineMap = constraintMap->_child; timelineMap; timelineMap = timelineMap->_next) {
			keyMap = timelineMap->_child;
			if (keyMap == NULL) continue;
			const char *timelineName = timelineMap->_name;
			int frames = timelineMap->_size;
			if (strcmp(timelineName, "position") == 0) {
				PathConstraintPositionTimeline *timeline = new (__FILE__, __LINE__) PathConstraintPositionTimeline(
						frames, frames, constraintIndex);
				timelines.add(
						readTimeline(keyMap, timeline, 0, constraint->_positionMode == PositionMode_Fixed ? _scale : 1));
			} else if (strcmp(timelineName, "spacing") == 0) {
				CurveTimeline1 *timeline = new PathConstraintSpacingTimeline(frames, frames,
																			 constraintIndex);
				timelines.add(readTimeline(keyMap, timeline, 0,
										   constraint->_spacingMode == SpacingMode_Length ||
														   constraint->_spacingMode == SpacingMode_Fixed
												   ? _scale
												   : 1));
			} else if (strcmp(timelineName, "mix") == 0) {
				PathConstraintMixTimeline *timeline = new PathConstraintMixTimeline(frames,
																					frames * 3, constraintIndex);
				float time = Json::getFloat(keyMap, "time", 0);
				float mixRotate = Json::getFloat(keyMap, "mixRotate", 1);
				float mixX = Json::getFloat(keyMap, "mixX", 1);
				float mixY = Json::getFloat(keyMap, "mixY", mixX);
				for (frame = 0, bezier = 0;; frame++) {
					timeline->setFrame(frame, time, mixRotate, mixX, mixY);
					nextMap = keyMap->_next;
					if (!nextMap) {
						// timeline.shrink(); // BOZO
						break;
					}
					float time2 = Json::getFloat(nextMap, "time", 0);
					float mixRotate2 = Json::getFloat(nextMap, "mixRotate", 1);
					float mixX2 = Json::getFloat(nextMap, "mixX", 1);
					float mixY2 = Json::getFloat(nextMap, "mixY", mixX2);
					curve = Json::getItem(keyMap, "curve");
					if (curve != NULL) {
						bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
						bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
					}
					time = time2;
					mixRotate = mixRotate2;
					mixX = mixX2;
					mixY = mixY2;
					keyMap = nextMap;
				}
				timelines.add(timeline);
			}
		}
	}

	/** Physics constraint timelines. */
	for (Json *constraintMap = physics ? physics->_child : 0; constraintMap; constraintMap = constraintMap->_next) {
		int index = -1;
		if (constraintMap->_name && strlen(constraintMap->_name) > 0) {
			PhysicsConstraintData *constraint = skeletonData->findPhysicsConstraint(constraintMap->_name);
			if (!constraint) {
				ContainerUtil::cleanUpVectorOfPointers(timelines);
				setError(NULL, "Physics constraint not found: ", constraintMap->_name);
				return NULL;
			}
			index = skeletonData->_physicsConstraints.indexOf(constraint);
		}
		for (Json *timelineMap = constraintMap->_child; timelineMap; timelineMap = timelineMap->_next) {
			keyMap = timelineMap->_child;
			if (keyMap == NULL) continue;
			const char *timelineName = timelineMap->_name;
			int frames = timelineMap->_size;
			if (strcmp(timelineName, "reset") == 0) {
				PhysicsConstraintResetTimeline *timeline = new (__FILE__, __LINE__) PhysicsConstraintResetTimeline(frames, index);
				for (frame = 0; keyMap != nullptr; keyMap = keyMap->_next, frame++) {
					timeline->setFrame(frame, Json::getFloat(keyMap, "time", 0));
				}
				timelines.add(timeline);
				continue;
			}

			CurveTimeline1 *timeline = nullptr;
			if (strcmp(timelineName, "inertia") == 0) {
				timeline = new PhysicsConstraintInertiaTimeline(frames, frames, index);
			} else if (strcmp(timelineName, "strength") == 0) {
				timeline = new PhysicsConstraintStrengthTimeline(frames, frames, index);
			} else if (strcmp(timelineName, "damping") == 0) {
				timeline = new PhysicsConstraintDampingTimeline(frames, frames, index);
			} else if (strcmp(timelineName, "mass") == 0) {
				timeline = new PhysicsConstraintMassTimeline(frames, frames, index);
			} else if (strcmp(timelineName, "wind") == 0) {
				timeline = new PhysicsConstraintWindTimeline(frames, frames, index);
			} else if (strcmp(timelineName, "gravity") == 0) {
				timeline = new PhysicsConstraintGravityTimeline(frames, frames, index);
			} else if (strcmp(timelineName, "mix") == 0) {
				timeline = new PhysicsConstraintMixTimeline(frames, frames, index);
			} else {
				continue;
			}
			timelines.add(readTimeline(keyMap, timeline, 0, 1));
		}
	}

	/** Attachment timelines. */
	for (Json *attachmenstMap = attachments ? attachments->_child : NULL; attachmenstMap; attachmenstMap = attachmenstMap->_next) {
		Skin *skin = skeletonData->findSkin(attachmenstMap->_name);
		for (slotMap = attachmenstMap->_child; slotMap; slotMap = slotMap->_next) {
			int slotIndex = findSlotIndex(skeletonData, slotMap->_name, timelines);
			if (slotIndex == -1) return NULL;

			for (Json *attachmentMap = slotMap->_child; attachmentMap; attachmentMap = attachmentMap->_next) {
				Attachment *attachment = skin->getAttachment(slotIndex, attachmentMap->_name);
				if (!attachment) {
					ContainerUtil::cleanUpVectorOfPointers(timelines);
					setError(NULL, "Attachment not found: ", attachmentMap->_name);
					return NULL;
				}

				for (Json *timelineMap = attachmentMap->_child; timelineMap; timelineMap = timelineMap->_next) {
					keyMap = timelineMap->_child;
					if (keyMap == NULL) continue;
					int frames = timelineMap->_size;
					String timelineName = timelineMap->_name;
					if (timelineName == "deform") {
						VertexAttachment *vertexAttachment = static_cast<VertexAttachment *>(attachment);
						bool weighted = vertexAttachment->_bones.size() != 0;
						Vector<float> &verts = vertexAttachment->_vertices;
						int deformLength = weighted ? (int) verts.size() / 3 * 2 : (int) verts.size();

						DeformTimeline *timeline = new (__FILE__, __LINE__) DeformTimeline(frames,
																						   frames, slotIndex, vertexAttachment);
						float time = Json::getFloat(keyMap, "time", 0);
						for (frame = 0, bezier = 0;; frame++) {
							Json *vertices = Json::getItem(keyMap, "vertices");
							Vector<float> deformed;
							if (!vertices) {
								if (weighted) {
									deformed.setSize(deformLength, 0);
								} else {
									deformed.clearAndAddAll(vertexAttachment->_vertices);
								}
							} else {
								deformed.setSize(deformLength, 0);
								int v, start = Json::getInt(keyMap, "offset", 0);
								Json *vertex;
								if (_scale == 1) {
									for (vertex = vertices->_child, v = start; vertex; vertex = vertex->_next, ++v) {
										deformed[v] = vertex->_valueFloat;
									}
								} else {
									for (vertex = vertices->_child, v = start; vertex; vertex = vertex->_next, ++v) {
										deformed[v] = vertex->_valueFloat * _scale;
									}
								}
								if (!weighted) {
									Vector<float> &verticesAttachment = vertexAttachment->_vertices;
									for (v = 0; v < deformLength; ++v) {
										deformed[v] += verticesAttachment[v];
									}
								}
							}
							timeline->setFrame(frame, time, deformed);
							nextMap = keyMap->_next;
							if (!nextMap) {
								// timeline.shrink(); // BOZO
								break;
							}
							float time2 = Json::getFloat(nextMap, "time", 0);
							curve = Json::getItem(keyMap, "curve");
							if (curve) {
								bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, 0, 1, 1);
							}
							time = time2;
							keyMap = nextMap;
						}
						timelines.add(timeline);
					} else if (timelineName == "sequence") {
						SequenceTimeline *timeline = new SequenceTimeline(frames, slotIndex, attachment);
						float lastDelay = 0;
						for (frame = 0; keyMap != NULL; keyMap = keyMap->_next, frame++) {
							float delay = Json::getFloat(keyMap, "delay", lastDelay);
							float time = Json::getFloat(keyMap, "time", 0);
							String modeString = Json::getString(keyMap, "mode", "hold");
							int index = Json::getInt(keyMap, "index", 0);
							SequenceMode mode = SequenceMode::hold;
							if (modeString == "once") mode = SequenceMode::once;
							if (modeString == "loop") mode = SequenceMode::loop;
							if (modeString == "pingpong") mode = SequenceMode::pingpong;
							if (modeString == "onceReverse") mode = SequenceMode::onceReverse;
							if (modeString == "loopReverse") mode = SequenceMode::loopReverse;
							if (modeString == "pingpongReverse") mode = SequenceMode::pingpongReverse;
							timeline->setFrame(frame, time, mode, index, delay);
							lastDelay = delay;
						}
						timelines.add(timeline);
					}
				}
			}
		}
	}

	/** Draw order timeline. */
	if (drawOrder) {
		DrawOrderTimeline *timeline = new (__FILE__, __LINE__) DrawOrderTimeline(drawOrder->_size);

		for (keyMap = drawOrder->_child, frame = 0; keyMap; keyMap = keyMap->_next, ++frame) {
			int ii;
			Vector<int> drawOrder2;
			Json *offsets = Json::getItem(keyMap, "offsets");
			if (offsets) {
				Json *offsetMap;
				Vector<int> unchanged;
				unchanged.ensureCapacity(skeletonData->_slots.size() - offsets->_size);
				unchanged.setSize(skeletonData->_slots.size() - offsets->_size, 0);
				size_t originalIndex = 0, unchangedIndex = 0;

				drawOrder2.ensureCapacity(skeletonData->_slots.size());
				drawOrder2.setSize(skeletonData->_slots.size(), 0);
				for (ii = (int) skeletonData->_slots.size() - 1; ii >= 0; --ii)
					drawOrder2[ii] = -1;

				for (offsetMap = offsets->_child; offsetMap; offsetMap = offsetMap->_next) {
					int slotIndex = findSlotIndex(skeletonData, Json::getString(offsetMap, "slot", 0), timelines);
					if (slotIndex == -1) return NULL;

					/* Collect unchanged items. */
					while (originalIndex != (size_t) slotIndex)
						unchanged[unchangedIndex++] = (int) originalIndex++;
					/* Set changed items. */
					drawOrder2[originalIndex + Json::getInt(offsetMap, "offset", 0)] = (int) originalIndex;
					originalIndex++;
				}
				/* Collect remaining unchanged items. */
				while ((int) originalIndex < (int) skeletonData->_slots.size())
					unchanged[unchangedIndex++] = (int) originalIndex++;
				/* Fill in unchanged items. */
				for (ii = (int) skeletonData->_slots.size() - 1; ii >= 0; ii--)
					if (drawOrder2[ii] == -1) drawOrder2[ii] = unchanged[--unchangedIndex];
			}
			timeline->setFrame(frame, Json::getFloat(keyMap, "time", 0), drawOrder2);
		}
		timelines.add(timeline);
	}

	/** Event timeline. */
	if (events) {
		EventTimeline *timeline = new (__FILE__, __LINE__) EventTimeline(events->_size);

		for (keyMap = events->_child, frame = 0; keyMap; keyMap = keyMap->_next, ++frame) {
			Event *event;
			EventData *eventData = skeletonData->findEvent(Json::getString(keyMap, "name", 0));
			if (!eventData) {
				ContainerUtil::cleanUpVectorOfPointers(timelines);
				setError(NULL, "Event not found: ", Json::getString(keyMap, "name", 0));
				return NULL;
			}

			event = new (__FILE__, __LINE__) Event(Json::getFloat(keyMap, "time", 0), *eventData);
			event->_intValue = Json::getInt(keyMap, "int", eventData->_intValue);
			event->_floatValue = Json::getFloat(keyMap, "float", eventData->_floatValue);
			event->_stringValue = Json::getString(keyMap, "string", eventData->_stringValue.buffer());
			if (!eventData->_audioPath.isEmpty()) {
				event->_volume = Json::getFloat(keyMap, "volume", 1);
				event->_balance = Json::getFloat(keyMap, "balance", 0);
			}
			timeline->setFrame(frame, event);
		}
		timelines.add(timeline);
	}

	float duration = 0;
	for (size_t i = 0; i < timelines.size(); i++)
		duration = MathUtil::max(duration, timelines[i]->getDuration());
	return new (__FILE__, __LINE__) Animation(String(root->_name), timelines, duration);
}

void SkeletonJson::readVertices(Json *attachmentMap, VertexAttachment *attachment, size_t verticesLength) {
	Json *entry;
	size_t i, n, nn, entrySize;
	Vector<float> vertices;

	attachment->setWorldVerticesLength(verticesLength);

	entry = Json::getItem(attachmentMap, "vertices");
	entrySize = entry->_size;
	vertices.ensureCapacity(entrySize);
	vertices.setSize(entrySize, 0);
	for (entry = entry->_child, i = 0; entry; entry = entry->_next, ++i)
		vertices[i] = entry->_valueFloat;

	if (verticesLength == entrySize) {
		if (_scale != 1) {
			for (i = 0; i < entrySize; ++i)
				vertices[i] *= _scale;
		}

		attachment->getVertices().clearAndAddAll(vertices);
		return;
	}

	Vertices bonesAndWeights;
	bonesAndWeights._bones.ensureCapacity(verticesLength * 3);
	bonesAndWeights._vertices.ensureCapacity(verticesLength * 3 * 3);

	for (i = 0, n = entrySize; i < n;) {
		int boneCount = (int) vertices[i++];
		bonesAndWeights._bones.add(boneCount);
		for (nn = i + boneCount * 4; i < nn; i += 4) {
			bonesAndWeights._bones.add((int) vertices[i]);
			bonesAndWeights._vertices.add(vertices[i + 1] * _scale);
			bonesAndWeights._vertices.add(vertices[i + 2] * _scale);
			bonesAndWeights._vertices.add(vertices[i + 3]);
		}
	}

	attachment->getVertices().clearAndAddAll(bonesAndWeights._vertices);
	attachment->getBones().clearAndAddAll(bonesAndWeights._bones);
}

void SkeletonJson::setError(Json *root, const String &value1, const String &value2) {
	_error = String(value1).append(value2);
	delete root;
}
