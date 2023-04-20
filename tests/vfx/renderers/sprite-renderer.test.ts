import { SpriteParticleRenderer } from "../../../cocos/vfx/renderers";

describe('sprite-renderer module', () => {
    test('renderingSubMesh', () => {
        const spriteRenderer = new SpriteParticleRenderer();
        expect(spriteRenderer.renderingSubMesh).toBeFalsy();
    });
});