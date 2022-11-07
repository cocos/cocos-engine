import { director, game } from "../../cocos/game";
import { ParticleSystem } from "../../exports/particle";
import { Node, Scene } from "../../cocos/scene-graph";

test('stop emitting', () => {
    const scene = new Scene('test-scene');
    director.runSceneImmediate(scene);
    const node = new Node();
    scene.addChild(node);
    game.step();
    const particleSystem = node.addComponent(ParticleSystem) as ParticleSystem;
    particleSystem.capacity = 1000;
    particleSystem.startLifetime.constant = 5;
    particleSystem.rateOverTime.constant = 100;
    particleSystem.play();
    for (let i = 0; i < 60; i++) {
        game.step();
    }
    expect(particleSystem.getParticleCount()).toBe(100);
    particleSystem.stopEmitting();
    for (let i = 0; i < 60; i++) {
        game.step();
    }
    expect(particleSystem.getParticleCount()).toBe(100);
    particleSystem.play();
    for (let i = 0; i < 60; i++) {
        game.step();
    }
    expect(particleSystem.getParticleCount()).toBe(200);
    particleSystem.stop();
    expect(particleSystem.getParticleCount()).toBe(0);
});