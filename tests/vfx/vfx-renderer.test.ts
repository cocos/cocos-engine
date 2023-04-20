import { VFXRenderer } from '../../cocos/vfx/vfx-renderer';
import { Node, Scene} from '../../cocos/scene-graph';
import { VFXEmitter } from '../../cocos/vfx/vfx-emitter';
import { director, game } from '../../cocos/game';

describe('vfx-renderer', () => {
    const node = new Node();
    const renderer = node.addComponent<VFXRenderer>(VFXRenderer);
    const emitter = renderer.getComponent<VFXEmitter>(VFXEmitter);
    

    test('vfx-renderer enabled', () => {
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