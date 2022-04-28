import { Node } from "../../../cocos/core";
import { Subregion } from "../../../cocos/core/animation/subregion/subregion";
import { ParticleSystemSubRegionPlayer } from "../../../cocos/core/animation/subregion/particle-system-subregion";
import { SubRegionHostMock } from "./util";
import { ParticleSystem } from "../../../cocos/particle";

test('Particle system subregion test', () => {
    const rootNode = new Node('Root Node');
    const nodeThatDoesNotIncludeAParticleSystem = new Node('Does Not Include a Particle System');
    rootNode.addChild(nodeThatDoesNotIncludeAParticleSystem);
    const particleSystemNode = new Node('Particle System Node');
    particleSystemNode.addComponent(ParticleSystem);
    rootNode.addChild(particleSystemNode);

    {
        const subregion = new Subregion();
        const player = subregion.player = new ParticleSystemSubRegionPlayer();
        player.path = 'Non-existing node';

        const host = new SubRegionHostMock(rootNode, subregion);
        expect(host.wellInstantiated).toBe(false);
    }

    {
        const subregion = new Subregion();
        const player = subregion.player = new ParticleSystemSubRegionPlayer();
        player.path = 'Does Not Include a Particle System';

        const host = new SubRegionHostMock(rootNode, subregion);
        expect(host.wellInstantiated).toBe(false);
    }

    {
        const subregion = new Subregion();
        const player = subregion.player = new ParticleSystemSubRegionPlayer();
        player.path = 'Particle System Node';
        const host = new SubRegionHostMock(rootNode, subregion);
        expect(host.wellInstantiated).toBe(true);
    }
});