import Ammo from 'ammo.js';

export enum AmmoCollisionFlags {
    CF_STATIC_OBJECT = 1,
    CF_KINEMATIC_OBJECT = 2,
    CF_NO_CONTACT_RESPONSE = 4,
    CF_CUSTOM_MATERIAL_CALLBACK = 8,//this allows per-triangle material (friction/restitution)
    CF_CHARACTER_OBJECT = 16,
    CF_DISABLE_VISUALIZE_OBJECT = 32, //disable debug drawing
    CF_DISABLE_SPU_COLLISION_PROCESSING = 64//disable parallel/SPU processing
};
(Ammo as any).AmmoCollisionFlags = AmmoCollisionFlags;

export enum AmmoCollisionObjectTypes {
    CO_COLLISION_OBJECT = 1,
    CO_RIGID_BODY = 2,
    ///CO_GHOST_OBJECT keeps track of all objects overlapping its AABB and that pass its collision filter
    ///It is useful for collision sensors, explosion objects, character controller etc.
    CO_GHOST_OBJECT = 4,
    CO_SOFT_BODY = 8,
    CO_HF_FLUID = 16,
    CO_USER_TYPE = 32,
    CO_FEATHERSTONE_LINK = 64
};
(Ammo as any).AmmoCollisionObjectTypes = AmmoCollisionObjectTypes;

export enum AmmoAnisotropicFrictionFlags {
    CF_ANISOTROPIC_FRICTION_DISABLED = 0,
    CF_ANISOTROPIC_FRICTION = 1,
    CF_ANISOTROPIC_ROLLING_FRICTION = 2
};
(Ammo as any).AmmoAnisotropicFrictionFlags = AmmoAnisotropicFrictionFlags;

export enum AmmoRigidBodyFlags {
    BT_DISABLE_WORLD_GRAVITY = 1,
    ///The BT_ENABLE_GYROPSCOPIC_FORCE can easily introduce instability
    ///So generally it is best to not enable it. 
    ///If really needed, run at a high frequency like 1000 Hertz:	///See Demos/GyroscopicDemo for an example use
    BT_ENABLE_GYROPSCOPIC_FORCE = 2
};
(Ammo as any).AmmoRigidBodyFlags = AmmoRigidBodyFlags;