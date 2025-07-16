import { Quat, Vec3 } from "../../cocos/core";
import { director } from "../../cocos/game";
import { Node } from "../../cocos/scene-graph";
import { ICollisionEvent, physics } from "../../exports/physics-framework";
import { PhysicsTestEnv } from "./physics.test";

/**
 * This function is used to test the api of the CharacterController
 */
function testCharacterControllerAPIs(cct: physics.CharacterController){
    cct.minMoveDistance = 0.001;
    expect(cct.minMoveDistance === 0.001).toBe(true);

    cct.stepOffset = 0.5;
    expect(cct.stepOffset === 0.5).toBe(true);

    cct.slopeLimit = 60;
    expect(cct.slopeLimit === 60).toBe(true);

    cct.skinWidth = 0.01;
    expect(cct.skinWidth === 0.01).toBe(true);

    cct.center = new Vec3(0, 0.5, 0);
    expect(Vec3.equals(cct.center, new Vec3(0, 0.5, 0))).toBe(true);

    let targetPos = new Vec3(0, 10, 0);
    cct.centerWorldPosition = targetPos;
    let newPos = new Vec3();
    newPos.set(cct.centerWorldPosition);
    expect(Vec3.equals(newPos, targetPos)).toBe(true);
    
    {
        cct.move(new Vec3(0, 0, 0));
        const dt = physics.PhysicsSystem.instance.fixedTimeStep;
        director.tick(dt);
        let newPos = new Vec3();
        newPos.set(cct.centerWorldPosition);
        expect(Vec3.equals(newPos, targetPos)).toBe(true);
    }
    {
        let movement = new Vec3(0, 10, 0);
        Vec3.add(targetPos, targetPos, movement);
        cct.move(movement);
        const dt = physics.PhysicsSystem.instance.fixedTimeStep;
        director.tick(dt);
        let newPos = new Vec3();
        newPos.set(cct.centerWorldPosition);
        expect(Vec3.equals(newPos, targetPos)).toBe(true);
    }
}

export default function (env: PhysicsTestEnv, _steps = 0) {
    //skip builtin and cannon.js for now
     if (env.backendId === 'builtin' || env.backendId === 'cannon.js') 
        return;

    describe(`Character controller`, () => {
        test(`Box character controller`, () => {
            const { rootNode: parent } = env;

            const nodeBoxCCT = new Node('BoxCharacterController');
            parent.addChild(nodeBoxCCT);
            const boxCCT = nodeBoxCCT.addComponent(physics.BoxCharacterController) as physics.BoxCharacterController;
            expect(boxCCT.type).toBe(physics.ECharacterControllerType.BOX);
    
            boxCCT.halfForwardExtent = 0.5;
            expect(boxCCT.halfForwardExtent === 0.5).toBe(true);
    
            boxCCT.halfSideExtent = 0.5;
            expect(boxCCT.halfSideExtent === 0.5).toBe(true);
    
            boxCCT.halfHeight = 0.5;
            expect(boxCCT.halfHeight === 0.5).toBe(true);
    
            testCharacterControllerAPIs(boxCCT as physics.CharacterController);
        });

        test(`Capsule character, controller`, () => {
            const { rootNode: parent } = env;

            const nodeCapsuleCCT = new Node('CapsuleCharacterController');
            parent.addChild(nodeCapsuleCCT);
            const capsuleCCT = nodeCapsuleCCT.addComponent(physics.CapsuleCharacterController) as physics.CapsuleCharacterController;
            expect(capsuleCCT.type).toBe(physics.ECharacterControllerType.CAPSULE);
    
            capsuleCCT.radius = 0.5;
            expect(capsuleCCT.radius === 0.5).toBe(true);
    
            capsuleCCT.height = 1;
            expect(capsuleCCT.height === 1).toBe(true);
    
            testCharacterControllerAPIs(capsuleCCT as physics.CharacterController);
        });
    });
}