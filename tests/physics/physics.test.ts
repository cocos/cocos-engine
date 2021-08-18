import { director, Node, Scene } from "../../cocos/core";
import { physics, PhysicsSystem } from "../../exports/physics-framework";
import "../../exports/physics-physx";
import "../../exports/physics-builtin";
import waitForAmmoInstantiation from "../../exports/wait-for-ammo-instantiation";
waitForAmmoInstantiation(null);
import "../../exports/physics-ammo";
import "../../exports/physics-cannon";

import EventTest from "./event";
import RaycastTest from "./raycast";
import SleepTest from "./sleep";
import StableTest from "./stability";
import VolumeTest from "./volume";
import FilterTest from "./filtering";
import DynamicTest from "./dynamic";

// Manually construct and register the system
PhysicsSystem.constructAndRegister();

test(`physics test | selector`, done => {
    physics.selector.switchTo('builtin');
    expect(physics.selector.id).toBe('builtin');
    done();
});

for (const id in physics.selector.backend) {
    test(`physics test | ${id}`, done => {
        // test selector
        physics.selector.switchTo(id);
        expect(physics.selector.id).toBe(id);

        const scene = new Scene('test');
        director.runSceneImmediate(scene);

        const temp0 = new Node();
        scene.addChild(temp0);

        // test events
        EventTest(temp0);

        // test raycast
        RaycastTest(temp0);

        if (physics.PhysicsSystem.PHYSICS_BUILTIN) {
            temp0.destroy();
            scene.destroy();
            return done();
        }

        // test auto sleep state
        SleepTest(temp0);

        // test stable
        [1, 0.5].forEach((v) => { StableTest(temp0, 500, v); });

        if (physics.PhysicsSystem.PHYSICS_PHYSX) {
            // test small scale in physx
            [0.25, 0.15].forEach((v) => { StableTest(temp0, 500, v); });
        }

        // test volume
        VolumeTest(temp0);

        // test filter
        FilterTest(temp0);

        // test rigid body
        DynamicTest(temp0);

        temp0.destroy();
        scene.destroy();
        // all works done
        done();
    });
}