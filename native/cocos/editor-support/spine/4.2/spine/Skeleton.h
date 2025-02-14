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

#ifndef Spine_Skeleton_h
#define Spine_Skeleton_h

#include <spine/Vector.h>
#include <spine/MathUtil.h>
#include <spine/SpineObject.h>
#include <spine/SpineString.h>
#include <spine/Color.h>
#include <spine/Physics.h>

namespace spine {
	class SkeletonData;

	class Bone;

	class Updatable;

	class Slot;

	class IkConstraint;

	class PathConstraint;

    class PhysicsConstraint;

	class TransformConstraint;

	class Skin;

	class Attachment;

    class SkeletonClipping;

	class SP_API Skeleton : public SpineObject {
		friend class AnimationState;

		friend class SkeletonBounds;

		friend class SkeletonClipping;

		friend class AttachmentTimeline;

		friend class RGBATimeline;

		friend class RGBTimeline;

		friend class AlphaTimeline;

		friend class RGBA2Timeline;

		friend class RGB2Timeline;

		friend class DeformTimeline;

		friend class DrawOrderTimeline;

		friend class EventTimeline;

		friend class IkConstraintTimeline;

		friend class PathConstraintMixTimeline;

		friend class PathConstraintPositionTimeline;

		friend class PathConstraintSpacingTimeline;

		friend class ScaleTimeline;

		friend class ScaleXTimeline;

		friend class ScaleYTimeline;

		friend class ShearTimeline;

		friend class ShearXTimeline;

		friend class ShearYTimeline;

		friend class TransformConstraintTimeline;

		friend class RotateTimeline;

		friend class TranslateTimeline;

		friend class TranslateXTimeline;

		friend class TranslateYTimeline;

		friend class TwoColorTimeline;

	public:
		explicit Skeleton(SkeletonData *skeletonData);

		~Skeleton();

		/// Caches information about bones and constraints. Must be called if bones, constraints or weighted path attachments are added
		/// or removed.
		void updateCache();

		void printUpdateCache();

        /// Updates the world transform for each bone and applies all constraints.
        ///
        /// See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
        /// Runtimes Guide.
		void updateWorldTransform(Physics physics);

		void updateWorldTransform(Physics physics, Bone *parent);

		/// Sets the bones, constraints, and slots to their setup pose values.
		void setToSetupPose();

		/// Sets the bones and constraints to their setup pose values.
		void setBonesToSetupPose();

		void setSlotsToSetupPose();

		/// @return May be NULL.
		Bone *findBone(const String &boneName);

		/// @return May be NULL.
		Slot *findSlot(const String &slotName);

		/// Sets a skin by name (see setSkin).
		void setSkin(const String &skinName);

		/// Attachments from the new skin are attached if the corresponding attachment from the old skin was attached.
		/// If there was no old skin, each slot's setup mode attachment is attached from the new skin.
		/// After changing the skin, the visible attachments can be reset to those attached in the setup pose by calling
		/// See Skeleton::setSlotsToSetupPose()
		/// Also, often AnimationState::apply(Skeleton&) is called before the next time the
		/// skeleton is rendered to allow any attachment keys in the current animation(s) to hide or show attachments from the new skin.
		/// @param newSkin May be NULL.
		void setSkin(Skin *newSkin);

		/// @return May be NULL.
		Attachment *getAttachment(const String &slotName, const String &attachmentName);

		/// @return May be NULL.
		Attachment *getAttachment(int slotIndex, const String &attachmentName);

		/// @param attachmentName May be empty.
		void setAttachment(const String &slotName, const String &attachmentName);

		/// @return May be NULL.
		IkConstraint *findIkConstraint(const String &constraintName);

		/// @return May be NULL.
		TransformConstraint *findTransformConstraint(const String &constraintName);

		/// @return May be NULL.
		PathConstraint *findPathConstraint(const String &constraintName);

        /// @return May be NULL.
        PhysicsConstraint *findPhysicsConstraint(const String &constraintName);

		/// Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
		/// @param outX The horizontal distance between the skeleton origin and the left side of the AABB.
		/// @param outY The vertical distance between the skeleton origin and the bottom side of the AABB.
		/// @param outWidth The width of the AABB
		/// @param outHeight The height of the AABB.
		/// @param outVertexBuffer Reference to hold a Vector of floats. This method will assign it with new floats as needed.
		// @param clipping Pointer to a SkeletonClipping instance or NULL. If a clipper is given, clipping attachments will be taken into account.
        void getBounds(float &outX, float &outY, float &outWidth, float &outHeight, Vector<float> &outVertexBuffer);
		void getBounds(float &outX, float &outY, float &outWidth, float &outHeight, Vector<float> &outVertexBuffer, SkeletonClipping *clipper);

		Bone *getRootBone();

		SkeletonData *getData();

		Vector<Bone *> &getBones();

		Vector<Updatable *> &getUpdateCacheList();

		Vector<Slot *> &getSlots();

		Vector<Slot *> &getDrawOrder();

		Vector<IkConstraint *> &getIkConstraints();

		Vector<PathConstraint *> &getPathConstraints();

		Vector<TransformConstraint *> &getTransformConstraints();

        Vector<PhysicsConstraint *> &getPhysicsConstraints();

		Skin *getSkin();

		Color &getColor();

		void setPosition(float x, float y);

		float getX();

		void setX(float inValue);

		float getY();

		void setY(float inValue);

		float getScaleX();

		void setScaleX(float inValue);

		float getScaleY();

		void setScaleY(float inValue);

        float getTime();

        void setTime(float time);

        void update(float delta);

        /// Rotates the physics constraint so next {@link #update(Physics)} forces are applied as if the bone rotated around the
	    /// specified point in world space.
        void physicsTranslate(float x, float y);

        /// Calls {@link PhysicsConstraint#rotate(float, float, float)} for each physics constraint. */
        void physicsRotate(float x, float y, float degrees);
    #ifndef __EMSCRIPTEN__
	private:
	#endif
		SkeletonData *_data;
		Vector<Bone *> _bones;
		Vector<Slot *> _slots;
		Vector<Slot *> _drawOrder;
		Vector<IkConstraint *> _ikConstraints;
		Vector<TransformConstraint *> _transformConstraints;
		Vector<PathConstraint *> _pathConstraints;
        Vector<PhysicsConstraint *> _physicsConstraints;
		Vector<Updatable *> _updateCache;
		Skin *_skin;
		Color _color;
		float _scaleX, _scaleY;
		float _x, _y;
        float _time;

		void sortIkConstraint(IkConstraint *constraint);

		void sortPathConstraint(PathConstraint *constraint);

        void sortPhysicsConstraint(PhysicsConstraint *constraint);

		void sortTransformConstraint(TransformConstraint *constraint);

		void sortPathConstraintAttachment(Skin *skin, size_t slotIndex, Bone &slotBone);

		void sortPathConstraintAttachment(Attachment *attachment, Bone &slotBone);

		void sortBone(Bone *bone);

		static void sortReset(Vector<Bone *> &bones);
	};
}

#endif /* Spine_Skeleton_h */
