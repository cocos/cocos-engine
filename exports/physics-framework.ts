/**
 * @hidden
 */

let physicsEngine = "";

if (globalThis && globalThis['_CCSettings']) {
    const physics: { physicsEngine: string } = globalThis['_CCSettings'].physics;
    if (physics) {
        physicsEngine = physics.physicsEngine;
    }
}
globalThis['CC_PHYSICS_BUILTIN'] = physicsEngine == "physics-builtin";
globalThis['CC_PHYSICS_CANNON'] = physicsEngine == "physics-cannon";
globalThis['CC_PHYSICS_AMMO'] = physicsEngine == "physics-ammo";

export * from '../cocos/physics/framework';