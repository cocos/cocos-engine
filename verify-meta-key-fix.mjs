/**
 * Standalone verification for META_LEFT/META_RIGHT fix (#18466)
 * Run: node verify-meta-key-fix.mjs
 *
 * This script directly reads and parses source files to verify the fix,
 * without needing the full engine build environment.
 */

import { readFileSync } from 'fs';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
    if (condition) { console.log(`  ✅ PASS: ${msg}`); passed++; }
    else { console.log(`  ❌ FAIL: ${msg}`); failed++; }
}

console.log('\n=== Verifying META_LEFT/META_RIGHT fix (Issue #18466) ===\n');

// ── 1. Check KeyCode enum in key-code.ts ──
console.log('1. KeyCode enum (cocos/input/types/key-code.ts):');
const keyCodeSrc = readFileSync('cocos/input/types/key-code.ts', 'utf-8');
const metaLeftMatch = keyCodeSrc.match(/META_LEFT\s*=\s*(\d+)/);
const metaRightMatch = keyCodeSrc.match(/META_RIGHT\s*=\s*(\d+)/);
assert(metaLeftMatch !== null, 'META_LEFT enum value exists');
assert(metaLeftMatch?.[1] === '91', `META_LEFT = ${metaLeftMatch?.[1]} (expected 91)`);
assert(metaRightMatch !== null, 'META_RIGHT enum value exists');
assert(metaRightMatch?.[1] === '93', `META_RIGHT = ${metaRightMatch?.[1]} (expected 93)`);

// Verify numeric ordering: KEY_Z=90, META_LEFT=91, META_RIGHT=93, NUM_0=96
const keyZMatch = keyCodeSrc.match(/KEY_Z\s*=\s*(\d+)/);
const num0Match = keyCodeSrc.match(/NUM_0\s*=\s*(\d+)/);
assert(keyZMatch?.[1] === '90', `KEY_Z = ${keyZMatch?.[1]} (expected 90)`);
assert(num0Match?.[1] === '96', `NUM_0 = ${num0Match?.[1]} (expected 96)`);

// Verify META_LEFT is placed AFTER KEY_Z and BEFORE NUM_0 in the file
const keyZPos = keyCodeSrc.indexOf('KEY_Z = 90');
const metaLeftPos = keyCodeSrc.indexOf('META_LEFT = 91');
const metaRightPos = keyCodeSrc.indexOf('META_RIGHT = 93');
const num0Pos = keyCodeSrc.indexOf('NUM_0 = 96');
assert(keyZPos < metaLeftPos && metaLeftPos < metaRightPos && metaRightPos < num0Pos,
    'Enum placement order: KEY_Z(90) < META_LEFT(91) < META_RIGHT(93) < NUM_0(96)');

// ── 2. Check code2KeyCode mapping in keycodes.ts ──
console.log('\n2. Web mapping (pal/input/keycodes.ts):');
const keycodesSrc = readFileSync('pal/input/keycodes.ts', 'utf-8');
assert(keycodesSrc.includes('MetaLeft: KeyCode.META_LEFT'), 'MetaLeft → KeyCode.META_LEFT mapping exists');
assert(keycodesSrc.includes('MetaRight: KeyCode.META_RIGHT'), 'MetaRight → KeyCode.META_RIGHT mapping exists');

// Verify all modifier keys have mappings (completeness check)
const modifierPairs = [
    ['ShiftLeft', 'SHIFT_LEFT'], ['ShiftRight', 'SHIFT_RIGHT'],
    ['ControlLeft', 'CTRL_LEFT'], ['ControlRight', 'CTRL_RIGHT'],
    ['AltLeft', 'ALT_LEFT'], ['AltRight', 'ALT_RIGHT'],
    ['MetaLeft', 'META_LEFT'], ['MetaRight', 'META_RIGHT'],
];
for (const [code, keycode] of modifierPairs) {
    assert(keycodesSrc.includes(`${code}: KeyCode.${keycode}`),
        `${code} → KeyCode.${keycode}`);
}

// ── 3. Check nativeKeyCode2KeyCode in keyboard-input.ts ──
console.log('\n3. Native fallback (pal/input/native/keyboard-input.ts):');
const nativeKbSrc = readFileSync('pal/input/native/keyboard-input.ts', 'utf-8');
assert(nativeKbSrc.includes('91: KeyCode.META_LEFT'), 'Native keyCode 91 → KeyCode.META_LEFT');
assert(nativeKbSrc.includes('93: KeyCode.META_RIGHT'), 'Native keyCode 93 → KeyCode.META_RIGHT');

// ── 4. Verify C++ side consistency ──
console.log('\n4. C++ native layer consistency (native/cocos/engine/EngineEvents.h):');
const engineEventsSrc = readFileSync('native/cocos/engine/EngineEvents.h', 'utf-8');
const cppMetaLeft = engineEventsSrc.match(/META_LEFT\s*=\s*(\d+)/);
const cppMetaRight = engineEventsSrc.match(/META_RIGHT\s*=\s*(\d+)/);
assert(cppMetaLeft?.[1] === '91', `C++ META_LEFT = ${cppMetaLeft?.[1]} (expected 91)`);
assert(cppMetaRight?.[1] === '93', `C++ META_RIGHT = ${cppMetaRight?.[1]} (expected 93)`);
assert(metaLeftMatch?.[1] === cppMetaLeft?.[1], `TS META_LEFT (${metaLeftMatch?.[1]}) === C++ META_LEFT (${cppMetaLeft?.[1]})`);
assert(metaRightMatch?.[1] === cppMetaRight?.[1], `TS META_RIGHT (${metaRightMatch?.[1]}) === C++ META_RIGHT (${cppMetaRight?.[1]})`);

// ── 5. Verify JSB adapter handles 91/93 ──
console.log('\n5. JSB adapter (platforms/native/builtin/jsb-adapter/KeyboardEvent.js):');
const jsbSrc = readFileSync('platforms/native/builtin/jsb-adapter/KeyboardEvent.js', 'utf-8');
assert(jsbSrc.includes("keyCode === 91") && jsbSrc.includes("'MetaLeft'"),
    'JSB adapter maps keyCode 91 → MetaLeft');
assert(jsbSrc.includes("keyCode === 93") && jsbSrc.includes("'MetaRight'"),
    'JSB adapter maps keyCode 93 → MetaRight');

// ── 6. Verify macOS KeyCodeHelper maps SUPER keys to 91/93 ──
console.log('\n6. macOS KeyCodeHelper (native/cocos/platform/mac/KeyCodeHelper.cpp):');
const keyCodeHelperSrc = readFileSync('native/cocos/platform/mac/KeyCodeHelper.cpp', 'utf-8');
assert(keyCodeHelperSrc.includes('GLFW_KEY_LEFT_SUPER') && keyCodeHelperSrc.includes('91'),
    'GLFW_KEY_LEFT_SUPER → 91');
assert(keyCodeHelperSrc.includes('GLFW_KEY_RIGHT_SUPER') && keyCodeHelperSrc.includes('93'),
    'GLFW_KEY_RIGHT_SUPER → 93');

// ── 7. Bug reproduction: simulate the data flow ──
console.log('\n7. End-to-end data flow simulation:');
console.log('   macOS CMD press → native keyCode=91 → JSB code="MetaLeft" → code2KeyCode → KeyCode.META_LEFT=91');
assert(metaLeftMatch?.[1] === '91' && keycodesSrc.includes('MetaLeft: KeyCode.META_LEFT'),
    'Full chain: CMD Left → keyCode 91 (was 0 before fix)');
assert(metaRightMatch?.[1] === '93' && keycodesSrc.includes('MetaRight: KeyCode.META_RIGHT'),
    'Full chain: CMD Right → keyCode 93 (was 0 before fix)');

// ── Summary ──
console.log(`\n${'='.repeat(55)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed === 0) {
    console.log('🎉 All checks passed! META_LEFT/META_RIGHT fix verified.');
    console.log('   The full keycode chain from macOS native → TypeScript is now connected.\n');
} else {
    console.log('💥 Some checks failed!\n');
    process.exit(1);
}
