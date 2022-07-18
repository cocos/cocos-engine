import { director, game, Node, Scene } from "../../cocos/core";
import { legacyCC } from "../../cocos/core/global-exports";
import { containerManager } from "../../cocos/core/memop/container-manager";
import { ParticleSystem } from "../../exports/particle";

test('recycle pool release', () => {
    const scene = new Scene('test-scene');
    director.runSceneImmediate(scene);
    const node = new Node();
    scene.addChild(node);
    game.step();
    // @ts-expect-error access private property 
    const beforeLength = containerManager._pools.length;
    const comp = node.addComponent(ParticleSystem);
    game.step();
    // @ts-expect-error access private property  
    const currentLength = containerManager._pools.length;
    expect(currentLength).toBeGreaterThan(beforeLength);
    comp.destroy();
    game.step();

    // @ts-expect-error
    expect(containerManager._pools.length).toBeLessThan(currentLength);

    
});