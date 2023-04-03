import { SpriteRendererModule } from "../../../cocos/particle/modules";

describe('sprite-renderer module', () => {
    test('sprite-renderer module', () => {
        const spriteRenderer = new SpriteRendererModule();
        expect(spriteRenderer.renderingSubMesh).toBeFalsy();
    });
});