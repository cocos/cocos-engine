import { SpriteRendererModule } from "../../../cocos/particle/modules";

describe('sprite-renderer module', () => {
    test('renderingSubMesh', () => {
        const spriteRenderer = new SpriteRendererModule();
        expect(spriteRenderer.renderingSubMesh).toBeFalsy();
    });
});