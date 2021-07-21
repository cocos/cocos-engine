import { director, Node, Scene } from "../../cocos/core";
import { physics, PhysicsSystem } from "../../exports/physics-framework";
import "../../exports/physics-builtin";
import waitForAmmoInstantiation from "../../exports/wait-for-ammo-instantiation";
waitForAmmoInstantiation(null);
import "../../exports/physics-ammo";
import "../../exports/physics-physx";
import "../../exports/physics-cannon";

import EventTest from "./event";
import SleepTest from "./sleep";
import StableTest from "./stability";

// Manually construct and register the system
PhysicsSystem.constructAndRegister();

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
        temp0.destroyAllChildren();
        temp0.removeAllChildren();

        if (physics.PhysicsSystem.PHYSICS_BUILTIN) {
            temp0.destroy();
            scene.destroy();
            return done();
        }

        // test auto sleep state
        SleepTest(temp0);
        temp0.destroyAllChildren();
        temp0.removeAllChildren();

        // test stable
        StableTest(temp0);
        temp0.destroyAllChildren();
        temp0.removeAllChildren();

        temp0.destroy();
        scene.destroy();
        // all works done
        done();
    });
}