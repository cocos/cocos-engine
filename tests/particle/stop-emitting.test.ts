import { director, game, Node, Scene } from "../../cocos/core";
import { ParticleSystem } from "../../exports/particle";

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