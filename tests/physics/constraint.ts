import { Quat, Vec3 } from "../../cocos/core";
import { director } from "../../cocos/game";
import { Node } from "../../cocos/scene-graph";
import { ICollisionEvent, physics } from "../../exports/physics-framework";
import { PhysicsTestEnv } from "./physics.test";

function testConfigurableConstraintAPIs(child: Node) {
    const cs = child.addComponent(physics.ConfigurableConstraint) as physics.ConfigurableConstraint;

    {   
        const pivotA = new Vec3(1, 0, 0);
        const pivotB = new Vec3(0, 1, 0);

        cs.pivotA = pivotA;
        cs.pivotB = pivotB;
        expect(cs.pivotA).toEqual(pivotA);
        expect(cs.pivotB).toEqual(pivotB);

        const axis = new Vec3(1, 0, 0);
        const secondaryAxis = new Vec3(0, 1, 0);

        cs.axis = axis;
        cs.secondaryAxis = secondaryAxis;
        expect(cs.axis).toEqual(axis);
        expect(cs.secondaryAxis).toEqual(secondaryAxis);

        const maxForce = 1;
        const maxTorque = 2;

        cs.breakForce = maxForce;
        cs.breakTorque = maxTorque;

        expect(cs.breakForce).toBe(maxForce);
        expect(cs.breakTorque).toBe(maxTorque);
            
        const ll = cs.linearLimitSettings;
        const al = cs.angularLimitSettings;
        const ld = cs.linearDriverSettings;
        const ad = cs.angularDriverSettings;

        // linear limits
        const linearLower = new Vec3(-1, -1, -1);
        const linearUpper = new Vec3(1, 1, 1);

        ll.upper = linearUpper;
        ll.lower = linearLower;
        expect(cs.linearLimitSettings.lower).toEqual(linearLower);
        expect(cs.linearLimitSettings.upper).toEqual(linearUpper);

        const linearSoft = false;
        const linearStiffness = 1;
        const linearDamping = 2;
        const linearRestitution = 4;

        ll.enableSoftConstraint = linearSoft;
        ll.damping = linearDamping;
        ll.stiffness = linearStiffness;
        ll.restitution = linearRestitution;
        expect(ll.enableSoftConstraint).toBe(linearSoft);
        expect(ll.damping).toBe(linearDamping);
        expect(ll.stiffness).toBe(linearStiffness);
        expect(ll.restitution).toBe(linearRestitution);

        // angular limits
        const swingExtent1 = 1;
        const swingExtent2 = 2;
        const twistExtent = 0.8;

        al.swingExtent1 = swingExtent1;
        al.swingExtent2 = swingExtent2;
        al.twistExtent = twistExtent;
        expect(al.swingExtent1).toBe(swingExtent1);
        expect(al.swingExtent2).toBe(swingExtent2);
        expect(al.twistExtent).toBe(twistExtent);

        const swingSoft = false;
        const swingStiffness = 1;
        const swingDamping = 2;
        const swingRestitution = 4;
        al.enableSoftConstraintSwing = swingSoft;
        al.swingDamping = swingDamping;
        al.swingStiffness = swingStiffness;
        al.swingRestitution = swingRestitution;
        expect(al.enableSoftConstraintSwing).toBe(swingSoft);
        expect(al.swingDamping).toBe(swingDamping);
        expect(al.swingStiffness).toBe(swingStiffness);
        expect(al.swingRestitution).toBe(swingRestitution);

        const twistSoft = true;
        const twistStiffness = 1;
        const twistDamping = 2;
        const twistRestitution = 4;
        al.enableSoftConstraintTwist = twistSoft;
        al.twistDamping = twistDamping;
        al.twistStiffness = twistStiffness;
        al.twistRestitution = twistRestitution;
        expect(al.enableSoftConstraintSwing).toBe(swingSoft);
        expect(al.swingDamping).toBe(swingDamping);
        expect(al.swingStiffness).toBe(swingStiffness);
        expect(al.swingRestitution).toBe(swingRestitution);

        // driver
        const linearTargetPosition = new Vec3(1, 1, 1);
        const linearTargetVelocity = new Vec3(2, 2, 2);
        const linearForceLimit = 4;
        ld.targetPosition = linearTargetPosition;
        ld.targetVelocity = linearTargetVelocity;
        ld.strength = linearForceLimit;
        expect(ld.targetPosition).toEqual(linearTargetPosition);
        expect(ld.targetVelocity).toEqual(linearTargetVelocity);
        expect(ld.strength).toBe(linearForceLimit);

        const angularTargetPosition = new Vec3(1, 1, 1);
        const angularTargetVelocity = new Vec3(2, 2, 2);
        const angularForceLimit = 4;
        ad.targetOrientation = angularTargetPosition;
        ad.targetVelocity = angularTargetVelocity;
        ad.strength = angularForceLimit;
        expect(ad.targetOrientation).toEqual(angularTargetPosition);
        expect(ad.targetVelocity).toEqual(angularTargetVelocity);
        expect(ad.strength).toBe(angularForceLimit);
    }
    child.removeComponent(cs);
}

export default function (env: PhysicsTestEnv) {
    if (env.backendId === 'builtin' || env.backendId === 'cannon.js') {
        return;
    }

    test(`Configurable constraint`, () => {
        testConfigurableConstraintAPIs(env.rootNode);
    });
}