export enum AmmoCollisionFlags {
    CF_STATIC_OBJECT = 1,
    CF_KINEMATIC_OBJECT = 2,
    CF_NO_CONTACT_RESPONSE = 4,
    CF_CUSTOM_MATERIAL_CALLBACK = 8,//this allows per-triangle material (friction/restitution)
    CF_CHARACTER_OBJECT = 16,
    CF_DISABLE_VISUALIZE_OBJECT = 32, //disable debug drawing
    CF_DISABLE_SPU_COLLISION_PROCESSING = 64//disable parallel/SPU processing
};

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

export enum AmmoAnisotropicFrictionFlags {
    CF_ANISOTROPIC_FRICTION_DISABLED = 0,
    CF_ANISOTROPIC_FRICTION = 1,
    CF_ANISOTROPIC_ROLLING_FRICTION = 2
};

