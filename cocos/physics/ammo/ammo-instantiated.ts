
import AmmoClosure, * as AmmoJs from '@cocos/ammo';

const Ammo: typeof AmmoClosure = {} as any;

/**
 * `'@cocos/ammo'` exports an async namespace. Let's call it `Ammo`.
 * Contents of `Ammo` are only valid for access once `Ammo().then()` is called.
 * That means we should not only import the `Ammo` but also wait for its instantiation:
 * ```ts
 * import Ammo from '@cocos/ammo';
 * const v = Ammo.btVector3(); // Error: Ammo is not instantiated!
 * ```
 * 
 * That's why this module comes ---
 * The default export `Ammo` from this module has the meaning:
 * when you got the export, it had been instantiated.
 * 
 */
export { Ammo as default }; // Note: should not use `export default Ammo` since that's only a copy but we need live binding.

/**
 * With the stage 3 proposal "top level await",
 * we may got a simple `await waitForAmmoInstantiation();` statement in this module.
 * It guarantees the promise `waitForAmmoInstantiation()`
 * is resolved before this module finished its execution. 
 * But this technique is rarely implemented for now and can not be implemented in CommonJS.
 * We have to expose this waiting function to beg for earlier invocation by the external.
 * In Cocos Creator Editor's implementation,
 * it awaits for the:
 * ```ts
 * import thisFunction from 'cc.wait-for-ammo-instantiated';
 * await thisFunction();
 * ```
 * before `'cc.physics-ammo'` can be imported;
 * @param wasmBinary The .wasm file, if any.
 */
export function waitForAmmoInstantiation (wasmBinary?: ArrayBuffer) {
    // `this` needed by ammo closure.
    const ammoClosureThis: { Ammo: typeof import('@cocos/ammo') } = { } as any;
    if (typeof wasmBinary !== 'undefined') {
        // See https://emscripten.org/docs/compiling/WebAssembly.html#wasm-files-and-compilation
        Ammo['wasmBinary'] = wasmBinary;
    }
    return new Promise<void>((resolve, reject) => {
        (AmmoClosure as any).call(ammoClosureThis, Ammo).then(() => {
            resolve();
        });
    });
}

export namespace waitForAmmoInstantiation {
    /**
     * True if the `'@cocos/ammo'` is the WebAssembly edition.
     */
    export const isWasm = 'isWasm' in AmmoJs;
}