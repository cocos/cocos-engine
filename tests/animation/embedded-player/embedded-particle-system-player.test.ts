import { Node } from "../../../cocos/scene-graph";
import { EmbeddedPlayer } from "../../../cocos/animation/embedded-player/embedded-player";
import { EmbeddedParticleSystemPlayable } from "../../../cocos/animation/embedded-player/embedded-particle-system-player";
import { EmbeddedPlayerHostMock } from "./util";
import { ParticleSystem } from "../../../cocos/particle";
import { captureWarns } from "../../utils/log-capture";

test('Particle system embedded player test', () => {
    const rootNode = new Node('Root Node');
    const nodeThatDoesNotIncludeAParticleSystem = new Node('Does Not Include a Particle System');
    rootNode.addChild(nodeThatDoesNotIncludeAParticleSystem);
    const particleSystemNode = new Node('Particle System Node');
    particleSystemNode.addComponent(ParticleSystem);
    rootNode.addChild(particleSystemNode);

    {
        const embeddedPlayer = new EmbeddedPlayer();
        const player = embeddedPlayer.playable = new EmbeddedParticleSystemPlayable();
        player.path = 'Non-existing node';

        const warnWatcher = captureWarns();
        const host = new EmbeddedPlayerHostMock(rootNode, embeddedPlayer, 1.3);
        expect(warnWatcher.captured).toHaveLength(1);
        expect(warnWatcher.captured[0][0]).toMatch(/Non-existing node/);
        warnWatcher.stop();
    }

    {
        const embeddedPlayer = new EmbeddedPlayer();
        const player = embeddedPlayer.playable = new EmbeddedParticleSystemPlayable();
        player.path = 'Does Not Include a Particle System';

        const warnWatcher = captureWarns();
        const host = new EmbeddedPlayerHostMock(rootNode, embeddedPlayer, 1.3);
        expect(warnWatcher.captured).toHaveLength(1);
        expect(warnWatcher.captured[0][0]).toMatch(/Does Not Include a Particle System/);
        warnWatcher.stop();
    }

    {
        const embeddedPlayer = new EmbeddedPlayer();
        const player = embeddedPlayer.playable = new EmbeddedParticleSystemPlayable();
        player.path = 'Particle System Node';
        const warnWatcher = captureWarns();
        const host = new EmbeddedPlayerHostMock(rootNode, embeddedPlayer, 1.3);
        expect(host.randomAccessible).toBe(false);
        expect(warnWatcher.captured).toHaveLength(0);
        warnWatcher.stop();
    }
});