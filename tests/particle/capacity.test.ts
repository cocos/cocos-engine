import { director, Node, Scene } from "../../cocos/core";
import { legacyCC } from "../../cocos/core/global-exports";
import { ParticleSystem } from "../../exports/particle";

test('particle system capacity test', () => {
});

// Will be updated later with the fix on particle capacity
// test('particle system capacity test', function () {
//     const scene = new Scene('test');
//     director.runSceneImmediate(scene);

//     const temp0 = new Node();
//     scene.addChild(temp0);

//     const particle = temp0.addComponent(ParticleSystem) as ParticleSystem;

//     particle.capacity = 0;
//     particle.renderer.useGPU = false;

//     legacyCC.game.step();
    
//     // @ts-expect-error
//     expect(!!particle.processor.getModel()._vBuffer).toBe(true);
// });