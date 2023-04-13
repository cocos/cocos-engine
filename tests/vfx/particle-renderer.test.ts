import { ParticleRenderer } from '../../cocos/vfx/particle-renderer';
import { Node } from '../../cocos/core/scene-graph/node';
import { ParticleEmitter } from '../../cocos/vfx/particle-emitter';
import { director, game, Scene } from '../../cocos/core';

describe('particle-renderer', () => {
    const node = new Node();
    const renderer = node.addComponent<ParticleRenderer>(ParticleRenderer);
    const emitter = renderer.getComponent<ParticleEmitter>(ParticleEmitter);
    

    test('particle-renderer enabled', () => {
        const scene = new Scene('test');
        scene.addChild(node);
        director.runSceneImmediate(scene);
        game.step();
        expect(renderer).toBeTruthy();
        expect(emitter).toBeTruthy();   
        expect(renderer._collectModels().length).toBe(1);
        renderer.enabled = false;
        expect(renderer._collectModels().length).toBe(0);
        renderer.enabled = true;
        expect(renderer._collectModels().length).toBe(1);
    });

    test('model enabled', () => {
        renderer.updateRenderData();
        const models = renderer._collectModels();
        expect(models[0].subModels.length).toBe(0);
        expect(emitter!.particles.count).toBe(0);
        expect(models[0].enabled).toBe(false);
        emitter!.particles.addParticles(1);
        renderer.updateRenderData();
        expect(models[0].enabled).toBe(true);
        expect(models[0].subModels.length).toBe(0);
        emitter!.particles.removeParticle(0);
        expect(emitter!.particles.count).toBe(0);
        renderer.updateRenderData();
        expect(models[0].enabled).toBe(false);
    })
});