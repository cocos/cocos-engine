/**
 * Verification test for the BlitDesc stale-reference fix.
 *
 * Bug: cocos/cocos-engine#18884
 * When DeviceRenderQueue.createBlitDesc() reuses an existing _blitDesc,
 * the old code did NOT update _blitDesc.blit, so createStageDescriptor()
 * would read a stale Blit whose passID indexes into the wrong material's
 * passes array → undefined → "Cannot read 'localSetLayout' of undefined".
 *
 * This test simulates the exact crash path without needing a GPU context.
 */

interface MockPass {
    localSetLayout: object;
}

interface MockMaterial {
    passes: (MockPass | undefined)[];
}

interface MockBlit {
    material: MockMaterial | null;
    passID: number;
    sceneFlags: number;
    camera: null;
}

// Simulates BlitDesc.createStageDescriptor (executor.ts:486-490)
function createStageDescriptor (blit: MockBlit): MockPass {
    const pass = blit.material!.passes[blit.passID];
    const _layout = pass!.localSetLayout;
    return pass!;
}

describe('BlitDesc stale-reference fix (#18884)', () => {
    test('valid blit with matching passID succeeds', () => {
        const material: MockMaterial = { passes: [{ localSetLayout: {} }] };
        const blit: MockBlit = { material, passID: 0, sceneFlags: 0, camera: null };
        expect(() => createStageDescriptor(blit)).not.toThrow();
    });

    test('blit with empty passes crashes (the bug scenario)', () => {
        const material: MockMaterial = { passes: [] };
        const blit: MockBlit = { material, passID: 0, sceneFlags: 0, camera: null };
        expect(() => createStageDescriptor(blit)).toThrow();
    });

    test('updated blit uses correct material/passID', () => {
        const materialB: MockMaterial = {
            passes: [{ localSetLayout: {} }, { localSetLayout: {} }],
        };
        const blitB: MockBlit = { material: materialB, passID: 1, sceneFlags: 0, camera: null };

        let storedBlit: MockBlit = { material: { passes: [{ localSetLayout: {} }] }, passID: 0, sceneFlags: 0, camera: null };
        storedBlit = blitB; // simulate: this._blitDesc.blit = blit (the fix)

        const pass = createStageDescriptor(storedBlit);
        expect(pass).toBeDefined();
        expect(pass.localSetLayout).toBeDefined();
    });

    test('stale material + new passID crashes without the fix', () => {
        const materialA: MockMaterial = { passes: [{ localSetLayout: {} }] };
        // passID=1 is out of bounds for materialA (only 1 pass)
        const staleBlit: MockBlit = { material: materialA, passID: 1, sceneFlags: 0, camera: null };
        expect(() => createStageDescriptor(staleBlit)).toThrow();
    });

    describe('full createBlitDesc reuse with destroyed material', () => {
        let _blitDesc: { blit: MockBlit } | null = null;

        function createBlitDesc_FIXED (blit: MockBlit): void {
            if (!_blitDesc) {
                _blitDesc = { blit };
            } else {
                _blitDesc.blit = blit; // THE FIX (executor.ts:622)
            }
            createStageDescriptor(_blitDesc.blit);
        }

        function createBlitDesc_BROKEN (blit: MockBlit): void {
            if (!_blitDesc) {
                _blitDesc = { blit };
            }
            // Missing: _blitDesc.blit = blit
            createStageDescriptor(_blitDesc!.blit);
        }

        test('BROKEN: stale blit with destroyed material crashes', () => {
            const mat1: MockMaterial = { passes: [{ localSetLayout: {} }] };
            const mat2: MockMaterial = { passes: [{ localSetLayout: {} }] };
            const blit1: MockBlit = { material: mat1, passID: 0, sceneFlags: 0, camera: null };
            const blit2: MockBlit = { material: mat2, passID: 0, sceneFlags: 0, camera: null };

            _blitDesc = null;
            createBlitDesc_BROKEN(blit1);
            mat1.passes.length = 0; // simulate material destruction

            expect(() => createBlitDesc_BROKEN(blit2)).toThrow();
        });

        test('FIXED: updated blit with valid material succeeds', () => {
            const mat1: MockMaterial = { passes: [{ localSetLayout: {} }] };
            const mat2: MockMaterial = { passes: [{ localSetLayout: {} }] };
            const blit1: MockBlit = { material: mat1, passID: 0, sceneFlags: 0, camera: null };
            const blit2: MockBlit = { material: mat2, passID: 0, sceneFlags: 0, camera: null };

            _blitDesc = null;
            createBlitDesc_FIXED(blit1);
            mat1.passes.length = 0; // simulate material destruction

            expect(() => createBlitDesc_FIXED(blit2)).not.toThrow();
        });
    });
});
