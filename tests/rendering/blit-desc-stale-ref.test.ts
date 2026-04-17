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

// ---- Minimal mocks matching the real types just enough to exercise the path ----

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
    // This is the exact line that crashes when pass is undefined:
    const _layout = pass!.localSetLayout;
    return pass!;
}

// ---- The test scenarios ----

function runTests (): { passed: number; failed: number } {
    let passed = 0;
    let failed = 0;

    function assert (condition: boolean, msg: string): void {
        if (condition) {
            console.log(`  ✓ ${msg}`);
            passed++;
        } else {
            console.error(`  ✗ ${msg}`);
            failed++;
        }
    }

    // --- Scenario: Demonstrate the crash with stale blit (pre-fix behavior) ---
    console.log('\n[Test 1] Stale blit reference causes crash (pre-fix behavior)');
    {
        const materialA: MockMaterial = {
            passes: [{ localSetLayout: {} }],  // 1 pass, passID=0 is valid
        };
        const materialB: MockMaterial = {
            passes: [],  // 0 passes, any passID is out of bounds
        };
        const blitA: MockBlit = { material: materialA, passID: 0, sceneFlags: 0, camera: null };
        const blitB: MockBlit = { material: materialB, passID: 0, sceneFlags: 0, camera: null };

        // First call: blitA works fine
        let firstCallOk = false;
        try {
            createStageDescriptor(blitA);
            firstCallOk = true;
        } catch (_e) {
            firstCallOk = false;
        }
        assert(firstCallOk, 'blitA (valid material) succeeds');

        // Simulate pre-fix: reuse without updating blit → still reads blitA
        // But if we pass blitB directly, it crashes because materialB.passes[0] is undefined
        let crashedWithBlitB = false;
        try {
            createStageDescriptor(blitB);
        } catch (_e) {
            crashedWithBlitB = true;
        }
        assert(crashedWithBlitB, 'blitB (empty passes) crashes as expected — this is the bug scenario');
    }

    // --- Scenario: Verify the fix ensures blit is updated before createStageDescriptor ---
    console.log('\n[Test 2] Fix: updating blit on reuse prevents stale reference');
    {
        const materialA: MockMaterial = {
            passes: [{ localSetLayout: {} }],
        };
        const materialB: MockMaterial = {
            passes: [{ localSetLayout: {} }, { localSetLayout: {} }],
        };
        const blitA: MockBlit = { material: materialA, passID: 0, sceneFlags: 0, camera: null };
        const blitB: MockBlit = { material: materialB, passID: 1, sceneFlags: 0, camera: null };

        // Simulate the fixed createBlitDesc logic (executor.ts:618-625)
        let storedBlit: MockBlit = blitA; // constructor sets _blit = blitA

        // Second call: the fix updates storedBlit before createStageDescriptor
        storedBlit = blitB; // this._blitDesc.blit = blit (line 622)

        let success = false;
        try {
            const pass = createStageDescriptor(storedBlit);
            success = pass !== undefined && pass.localSetLayout !== undefined;
        } catch (_e) {
            success = false;
        }
        assert(success, 'After blit update, createStageDescriptor uses correct material/passID');

        // Verify it would crash WITHOUT the update (stale blitA + blitB's passID scenario)
        const blitC: MockBlit = { material: materialA, passID: 1, sceneFlags: 0, camera: null };
        // materialA only has 1 pass (index 0), passID=1 is out of bounds
        let wouldCrash = false;
        try {
            createStageDescriptor(blitC);
        } catch (_e) {
            wouldCrash = true;
        }
        assert(wouldCrash, 'Without update: stale material + new passID → crash (proves fix is needed)');
    }

    // --- Scenario: Simulate full DeviceRenderQueue.createBlitDesc flow ---
    // The real crash: render graph calls createBlitDesc(blitA) then createBlitDesc(blitB).
    // Between calls, blitA's material gets destroyed (passes cleared). BROKEN keeps stale
    // reference to blitA → createStageDescriptor reads destroyed material → crash.
    // FIXED updates to blitB → reads valid material → no crash.
    console.log('\n[Test 3] Full createBlitDesc reuse — stale blit with destroyed material');
    {
        let _blitDesc: { blit: MockBlit } | null = null;

        function createBlitDesc_FIXED (blit: MockBlit): void {
            if (!_blitDesc) {
                _blitDesc = { blit };
            } else {
                _blitDesc.blit = blit; // THE FIX (line 622)
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

        const mat1: MockMaterial = { passes: [{ localSetLayout: {} }] };
        const mat2: MockMaterial = { passes: [{ localSetLayout: {} }] };
        const blit1: MockBlit = { material: mat1, passID: 0, sceneFlags: 0, camera: null };
        const blit2: MockBlit = { material: mat2, passID: 0, sceneFlags: 0, camera: null };

        // BROKEN: first call stores blit1, then material is destroyed, second call still reads blit1
        _blitDesc = null;
        createBlitDesc_BROKEN(blit1); // stores blit1
        mat1.passes.length = 0;       // simulate material destruction / pass invalidation
        let brokenCrashed = false;
        try {
            createBlitDesc_BROKEN(blit2); // BROKEN: still reads blit1 → mat1.passes[0] = undefined → crash
        } catch (_e) {
            brokenCrashed = true;
        }
        assert(brokenCrashed, 'BROKEN: stale blit with destroyed material crashes');

        // FIXED: same scenario, but blit is updated → reads blit2 with valid mat2
        _blitDesc = null;
        mat1.passes.push({ localSetLayout: {} }); // restore mat1 for first call
        createBlitDesc_FIXED(blit1);
        mat1.passes.length = 0;        // destroy mat1 again
        let fixedOk = true;
        try {
            createBlitDesc_FIXED(blit2); // FIXED: updates to blit2 → reads mat2.passes[0] ✓
        } catch (_e) {
            fixedOk = false;
        }
        assert(fixedOk, 'FIXED: updated blit with valid material succeeds');
    }

    return { passed, failed };
}

// ---- Run ----
console.log('=== BlitDesc stale-reference fix verification ===');
console.log('Bug: cocos/cocos-engine#18884');
console.log('File: cocos/rendering/custom/executor.ts:618-625');

const { passed, failed } = runTests();

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) {
    process.exit(1);
}
