/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable max-len */
/* eslint-disable no-tabs */

/// enum ///

export enum EFilterDataWord3 {
    QUERY_FILTER = 1 << 0,
    QUERY_CHECK_TRIGGER = 1 << 1,
    QUERY_SINGLE_HIT = 1 << 2,
    DETECT_TRIGGER_EVENT = 1 << 3,
    DETECT_CONTACT_EVENT = 1 << 4,
    DETECT_CONTACT_POINT = 1 << 5,
    DETECT_CONTACT_CCD = 1 << 6,
}

export enum PxHitFlag {
    ePOSITION					= (1 << 0),	//! < "position" member of #PxQueryHit is valid
    eNORMAL						= (1 << 1),	//! < "normal" member of #PxQueryHit is valid
    eUV							= (1 << 3),	//! < "u" and "v" barycentric coordinates of #PxQueryHit are valid. Not applicable to sweep queries.
    eASSUME_NO_INITIAL_OVERLAP	= (1 << 4),	//! < Performance hint flag for sweeps when it is known upfront there's no initial overlap.
                                            //! < NOTE: using this flag may cause undefined results if shapes are initially overlapping.
    eMESH_MULTIPLE				= (1 << 5),	//! < Report all hits for meshes rather than just the first. Not applicable to sweep queries.
    eMESH_ANY					= (1 << 6),	//! < Report any first hit for meshes. If neither eMESH_MULTIPLE nor eMESH_ANY is specified,
                                            //! < a single closest hit will be reported for meshes.
    eMESH_BOTH_SIDES			= (1 << 7),	//! < Report hits with back faces of mesh triangles. Also report hits for raycast
                                            //! < originating on mesh surface and facing away from the surface normal. Not applicable to sweep queries.
                                            //! < Please refer to the user guide for heightfield-specific differences.
    ePRECISE_SWEEP				= (1 << 8),	//! < Use more accurate but slower narrow phase sweep tests.
                                            //! < May provide better compatibility with PhysX 3.2 sweep behavior.
    eMTD						= (1 << 9),	//! < Report the minimum translation depth, normal and contact point.
    eFACE_INDEX					= (1 << 10),	//! < "face index" member of #PxQueryHit is valid

    eDEFAULT					= PxHitFlag.ePOSITION | PxHitFlag.eNORMAL | PxHitFlag.eFACE_INDEX,

    /** \brief Only this subset of flags can be modified by pre-filter. Other modifications will be discarded. */
    eMODIFIABLE_FLAGS			= PxHitFlag.eMESH_MULTIPLE | PxHitFlag.eMESH_BOTH_SIDES | PxHitFlag.eASSUME_NO_INITIAL_OVERLAP | PxHitFlag.ePRECISE_SWEEP
}

export enum PxQueryFlag
{
    eSTATIC				= (1 << 0),	//! < Traverse static shapes

    eDYNAMIC			= (1 << 1),	//! < Traverse dynamic shapes

    ePREFILTER			= (1 << 2),	//! < Run the pre-intersection-test filter (see #PxQueryFilterCallback::preFilter())

    ePOSTFILTER			= (1 << 3),	//! < Run the post-intersection-test filter (see #PxQueryFilterCallback::postFilter())

    eANY_HIT			= (1 << 4),	//! < Abort traversal as soon as any hit is found and return it via callback.block.
                                    //! < Helps query performance. Both eTOUCH and eBLOCK hitTypes are considered hits with this flag.

    eNO_BLOCK			= (1 << 5),	//! < All hits are reported as touching. Overrides eBLOCK returned from user filters with eTOUCH.
                                    //! < This is also an optimization hint that may improve query performance.

    eRESERVED			= (1 << 15)	//! < Reserved for internal use
}

export enum PxPairFlag
{
    /**
    \brief Process the contacts of this collision pair in the dynamics solver.

    \note Only takes effect if the colliding actors are rigid bodies.
    */
    eSOLVE_CONTACT						= (1 << 0),

    /**
    \brief Call contact modification callback for this collision pair

    \note Only takes effect if the colliding actors are rigid bodies.

    @see PxContactModifyCallback
    */
    eMODIFY_CONTACTS					= (1 << 1),

    /**
    \brief Call contact report callback or trigger callback when this collision pair starts to be in contact.

    If one of the two collision objects is a trigger shape (see #PxShapeFlag::eTRIGGER_SHAPE)
    then the trigger callback will get called as soon as the other object enters the trigger volume.
    If none of the two collision objects is a trigger shape then the contact report callback will get
    called when the actors of this collision pair start to be in contact.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_FOUND					= (1 << 2),

    /**
    \brief Call contact report callback while this collision pair is in contact

    If none of the two collision objects is a trigger shape then the contact report callback will get
    called while the actors of this collision pair are in contact.

    \note Triggers do not support this event. Persistent trigger contacts need to be tracked separately by observing eNOTIFY_TOUCH_FOUND/eNOTIFY_TOUCH_LOST events.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note No report will get sent if the objects in contact are sleeping.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    \note If this flag gets enabled while a pair is in touch already, there will be no eNOTIFY_TOUCH_PERSISTS events until the pair loses and regains touch.

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_PERSISTS				= (1 << 3),

    /**
    \brief Call contact report callback or trigger callback when this collision pair stops to be in contact

    If one of the two collision objects is a trigger shape (see #PxShapeFlag::eTRIGGER_SHAPE)
    then the trigger callback will get called as soon as the other object leaves the trigger volume.
    If none of the two collision objects is a trigger shape then the contact report callback will get
    called when the actors of this collision pair stop to be in contact.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note This event will also get triggered if one of the colliding objects gets deleted.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_LOST					= (1 << 4),

    /**
    \brief Call contact report callback when this collision pair is in contact during CCD passes.

    If CCD with multiple passes is enabled, then a fast moving object might bounce on and off the same
    object multiple times. Hence, the same pair might be in contact multiple times during a simulation step.
    This flag will make sure that all the detected collision during CCD will get reported. For performance
    reasons, the system can not always tell whether the contact pair lost touch in one of the previous CCD
    passes and thus can also not always tell whether the contact is new or has persisted. eNOTIFY_TOUCH_CCD
    just reports when the two collision objects were detected as being in contact during a CCD pass.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note Trigger shapes are not supported.

    \note Only takes effect if eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_CCD					= (1 << 5),

    /**
    \brief Call contact report callback when the contact force between the actors of this collision pair exceeds one of the actor-defined force thresholds.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact()
    */
    eNOTIFY_THRESHOLD_FORCE_FOUND		= (1 << 6),

    /**
    \brief Call contact report callback when the contact force between the actors of this collision pair continues to exceed one of the actor-defined force thresholds.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note If a pair gets re-filtered and this flag has previously been disabled, then the report will not get fired in the same frame even if the force threshold has been reached in the
    previous one (unless #eNOTIFY_THRESHOLD_FORCE_FOUND has been set in the previous frame).

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact()
    */
    eNOTIFY_THRESHOLD_FORCE_PERSISTS	= (1 << 7),

    /**
    \brief Call contact report callback when the contact force between the actors of this collision pair falls below one of the actor-defined force thresholds (includes the case where this collision pair stops being in contact).

    \note Only takes effect if the colliding actors are rigid bodies.

    \note If a pair gets re-filtered and this flag has previously been disabled, then the report will not get fired in the same frame even if the force threshold has been reached in the
    previous one (unless #eNOTIFY_THRESHOLD_FORCE_FOUND or #eNOTIFY_THRESHOLD_FORCE_PERSISTS has been set in the previous frame).

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact()
    */
    eNOTIFY_THRESHOLD_FORCE_LOST		= (1 << 8),

    /**
    \brief Provide contact points in contact reports for this collision pair.

    \note Only takes effect if the colliding actors are rigid bodies and if used in combination with the flags eNOTIFY_TOUCH_... or eNOTIFY_THRESHOLD_FORCE_...

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxContactPair PxContactPair.extractContacts()
    */
    eNOTIFY_CONTACT_POINTS				= (1 << 9),

    /**
    \brief This flag is used to indicate whether this pair generates discrete collision detection contacts.

    \note Contacts are only responded to if eSOLVE_CONTACT is enabled.
    */
    eDETECT_DISCRETE_CONTACT			= (1 << 10),

    /**
    \brief This flag is used to indicate whether this pair generates CCD contacts.

    \note The contacts will only be responded to if eSOLVE_CONTACT is enabled on this pair.
    \note The scene must have PxSceneFlag::eENABLE_CCD enabled to use this feature.
    \note Non-static bodies of the pair should have PxRigidBodyFlag::eENABLE_CCD specified for this feature to work correctly.
    \note This flag is not supported with trigger shapes. However, CCD trigger events can be emulated using non-trigger shapes
    and requesting eNOTIFY_TOUCH_FOUND and eNOTIFY_TOUCH_LOST and not raising eSOLVE_CONTACT on the pair.

    @see PxRigidBodyFlag::eENABLE_CCD
    @see PxSceneFlag::eENABLE_CCD
    */
    eDETECT_CCD_CONTACT					= (1 << 11),

    /**
    \brief Provide pre solver velocities in contact reports for this collision pair.

    If the collision pair has contact reports enabled, the velocities of the rigid bodies before contacts have been solved
    will be provided in the contact report callback unless the pair lost touch in which case no data will be provided.

    \note Usually it is not necessary to request these velocities as they will be available by querying the velocity from the provided
    PxRigidActor object directly. However, it might be the case that the velocity of a rigid body gets set while the simulation is running
    in which case the PxRigidActor would return this new velocity in the contact report callback and not the velocity the simulation used.

    @see PxSimulationEventCallback.onContact(), PxContactPairVelocity, PxContactPairHeader.extraDataStream
    */
    ePRE_SOLVER_VELOCITY				= (1 << 12),

    /**
    \brief Provide post solver velocities in contact reports for this collision pair.

    If the collision pair has contact reports enabled, the velocities of the rigid bodies after contacts have been solved
    will be provided in the contact report callback unless the pair lost touch in which case no data will be provided.

    @see PxSimulationEventCallback.onContact(), PxContactPairVelocity, PxContactPairHeader.extraDataStream
    */
    ePOST_SOLVER_VELOCITY				= (1 << 13),

    /**
    \brief Provide rigid body poses in contact reports for this collision pair.

    If the collision pair has contact reports enabled, the rigid body poses at the contact event will be provided
    in the contact report callback unless the pair lost touch in which case no data will be provided.

    \note Usually it is not necessary to request these poses as they will be available by querying the pose from the provided
    PxRigidActor object directly. However, it might be the case that the pose of a rigid body gets set while the simulation is running
    in which case the PxRigidActor would return this new pose in the contact report callback and not the pose the simulation used.
    Another use case is related to CCD with multiple passes enabled, A fast moving object might bounce on and off the same
    object multiple times. This flag can be used to request the rigid body poses at the time of impact for each such collision event.

    @see PxSimulationEventCallback.onContact(), PxContactPairPose, PxContactPairHeader.extraDataStream
    */
    eCONTACT_EVENT_POSE					= (1 << 14),

    eNEXT_FREE							= (1 << 15),        //! < For internal use only.

    /**
    \brief Provided default flag to do simple contact processing for this collision pair.
    */
    eCONTACT_DEFAULT					= eSOLVE_CONTACT | eDETECT_DISCRETE_CONTACT,

    /**
    \brief Provided default flag to get commonly used trigger behavior for this collision pair.
    */
    eTRIGGER_DEFAULT					= eNOTIFY_TOUCH_FOUND | eNOTIFY_TOUCH_LOST | eDETECT_DISCRETE_CONTACT
}

export enum PxContactPairFlag {
    /**
    \brief The shape with index 0 has been removed from the actor/scene.
    */
    eREMOVED_SHAPE_0				= (1 << 0),

    /**
    \brief The shape with index 1 has been removed from the actor/scene.
    */
    eREMOVED_SHAPE_1				= (1 << 1),

    /**
    \brief First actor pair contact.

    The provided shape pair marks the first contact between the two actors, no other shape pair has been touching prior to the current simulation frame.

    \note: This info is only available if #PxPairFlag::eNOTIFY_TOUCH_FOUND has been declared for the pair.
    */
    eACTOR_PAIR_HAS_FIRST_TOUCH		= (1 << 2),

    /**
    \brief All contact between the actor pair was lost.

    All contact between the two actors has been lost, no shape pairs remain touching after the current simulation frame.
    */
    eACTOR_PAIR_LOST_TOUCH			= (1 << 3),

    /**
    \brief Internal flag, used by #PxContactPair.extractContacts()

    The applied contact impulses are provided for every contact point.
    This is the case if #PxPairFlag::eSOLVE_CONTACT has been set for the pair.
    */
    eINTERNAL_HAS_IMPULSES			= (1 << 4),

    /**
    \brief Internal flag, used by #PxContactPair.extractContacts()

    The provided contact point information is flipped with regards to the shapes of the contact pair. This mainly concerns the order of the internal triangle indices.
    */
    eINTERNAL_CONTACTS_ARE_FLIPPED	= (1 << 5)
}

export enum PxTriggerPairFlag
{
    eREMOVED_SHAPE_TRIGGER					= (1 << 0),					//! < The trigger shape has been removed from the actor/scene.
    eREMOVED_SHAPE_OTHER					= (1 << 1),					//! < The shape causing the trigger event has been removed from the actor/scene.
    eNEXT_FREE								= (1 << 2)					//! < For internal use only.
}
