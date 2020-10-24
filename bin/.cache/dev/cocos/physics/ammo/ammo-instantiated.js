(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/ammo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/ammo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammo);
    global.ammoInstantiated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, AmmoJs) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.waitForAmmoInstantiation = waitForAmmoInstantiation;
  _exports.default = void 0;
  AmmoJs = _interopRequireWildcard(AmmoJs);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  var Ammo = {};
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

  _exports.default = Ammo;

  // Note: should not use `export default Ammo` since that's only a copy but we need live binding.

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
  function waitForAmmoInstantiation(wasmBinary) {
    // `this` needed by ammo closure.
    var ammoClosureThis = {};

    if (typeof wasmBinary !== 'undefined') {
      // See https://emscripten.org/docs/compiling/WebAssembly.html#wasm-files-and-compilation
      Ammo['wasmBinary'] = wasmBinary;
    }

    return new Promise(function (resolve, reject) {
      AmmoJs.default.call(ammoClosureThis, Ammo).then(function () {
        resolve();
      });
    });
  }

  (function (_waitForAmmoInstantiation) {
    var isWasm = _waitForAmmoInstantiation.isWasm = 'isWasm' in AmmoJs;
  })(waitForAmmoInstantiation || (_exports.waitForAmmoInstantiation = waitForAmmoInstantiation = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLWluc3RhbnRpYXRlZC50cyJdLCJuYW1lcyI6WyJBbW1vIiwid2FpdEZvckFtbW9JbnN0YW50aWF0aW9uIiwid2FzbUJpbmFyeSIsImFtbW9DbG9zdXJlVGhpcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiQW1tb0Nsb3N1cmUiLCJjYWxsIiwidGhlbiIsImlzV2FzbSIsIkFtbW9KcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxNQUFNQSxJQUF3QixHQUFHLEVBQWpDO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYzRCOztBQUU1Qjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCTyxXQUFTQyx3QkFBVCxDQUFtQ0MsVUFBbkMsRUFBNkQ7QUFDaEU7QUFDQSxRQUFNQyxlQUF1RCxHQUFHLEVBQWhFOztBQUNBLFFBQUksT0FBT0QsVUFBUCxLQUFzQixXQUExQixFQUF1QztBQUNuQztBQUNBRixNQUFBQSxJQUFJLENBQUMsWUFBRCxDQUFKLEdBQXFCRSxVQUFyQjtBQUNIOztBQUNELFdBQU8sSUFBSUUsT0FBSixDQUFrQixVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDekNDLG9CQUFELENBQXFCQyxJQUFyQixDQUEwQkwsZUFBMUIsRUFBMkNILElBQTNDLEVBQWlEUyxJQUFqRCxDQUFzRCxZQUFNO0FBQ3hESixRQUFBQSxPQUFPO0FBQ1YsT0FGRDtBQUdILEtBSk0sQ0FBUDtBQUtIOzs7QUFNVSxRQUFNSyxNQUFNLHNDQUFHLFlBQVlDLE1BQTNCO0tBSk1WLHdCLHlDQUFBQSx3QiIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgQW1tb0Nsb3N1cmUsICogYXMgQW1tb0pzIGZyb20gJ0Bjb2Nvcy9hbW1vJztcclxuXHJcbmNvbnN0IEFtbW86IHR5cGVvZiBBbW1vQ2xvc3VyZSA9IHt9IGFzIGFueTtcclxuXHJcbi8qKlxyXG4gKiBgJ0Bjb2Nvcy9hbW1vJ2AgZXhwb3J0cyBhbiBhc3luYyBuYW1lc3BhY2UuIExldCdzIGNhbGwgaXQgYEFtbW9gLlxyXG4gKiBDb250ZW50cyBvZiBgQW1tb2AgYXJlIG9ubHkgdmFsaWQgZm9yIGFjY2VzcyBvbmNlIGBBbW1vKCkudGhlbigpYCBpcyBjYWxsZWQuXHJcbiAqIFRoYXQgbWVhbnMgd2Ugc2hvdWxkIG5vdCBvbmx5IGltcG9ydCB0aGUgYEFtbW9gIGJ1dCBhbHNvIHdhaXQgZm9yIGl0cyBpbnN0YW50aWF0aW9uOlxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgQW1tbyBmcm9tICdAY29jb3MvYW1tbyc7XHJcbiAqIGNvbnN0IHYgPSBBbW1vLmJ0VmVjdG9yMygpOyAvLyBFcnJvcjogQW1tbyBpcyBub3QgaW5zdGFudGlhdGVkIVxyXG4gKiBgYGBcclxuICogXHJcbiAqIFRoYXQncyB3aHkgdGhpcyBtb2R1bGUgY29tZXMgLS0tXHJcbiAqIFRoZSBkZWZhdWx0IGV4cG9ydCBgQW1tb2AgZnJvbSB0aGlzIG1vZHVsZSBoYXMgdGhlIG1lYW5pbmc6XHJcbiAqIHdoZW4geW91IGdvdCB0aGUgZXhwb3J0LCBpdCBoYWQgYmVlbiBpbnN0YW50aWF0ZWQuXHJcbiAqIFxyXG4gKi9cclxuZXhwb3J0IHsgQW1tbyBhcyBkZWZhdWx0IH07IC8vIE5vdGU6IHNob3VsZCBub3QgdXNlIGBleHBvcnQgZGVmYXVsdCBBbW1vYCBzaW5jZSB0aGF0J3Mgb25seSBhIGNvcHkgYnV0IHdlIG5lZWQgbGl2ZSBiaW5kaW5nLlxyXG5cclxuLyoqXHJcbiAqIFdpdGggdGhlIHN0YWdlIDMgcHJvcG9zYWwgXCJ0b3AgbGV2ZWwgYXdhaXRcIixcclxuICogd2UgbWF5IGdvdCBhIHNpbXBsZSBgYXdhaXQgd2FpdEZvckFtbW9JbnN0YW50aWF0aW9uKCk7YCBzdGF0ZW1lbnQgaW4gdGhpcyBtb2R1bGUuXHJcbiAqIEl0IGd1YXJhbnRlZXMgdGhlIHByb21pc2UgYHdhaXRGb3JBbW1vSW5zdGFudGlhdGlvbigpYFxyXG4gKiBpcyByZXNvbHZlZCBiZWZvcmUgdGhpcyBtb2R1bGUgZmluaXNoZWQgaXRzIGV4ZWN1dGlvbi4gXHJcbiAqIEJ1dCB0aGlzIHRlY2huaXF1ZSBpcyByYXJlbHkgaW1wbGVtZW50ZWQgZm9yIG5vdyBhbmQgY2FuIG5vdCBiZSBpbXBsZW1lbnRlZCBpbiBDb21tb25KUy5cclxuICogV2UgaGF2ZSB0byBleHBvc2UgdGhpcyB3YWl0aW5nIGZ1bmN0aW9uIHRvIGJlZyBmb3IgZWFybGllciBpbnZvY2F0aW9uIGJ5IHRoZSBleHRlcm5hbC5cclxuICogSW4gQ29jb3MgQ3JlYXRvciBFZGl0b3IncyBpbXBsZW1lbnRhdGlvbixcclxuICogaXQgYXdhaXRzIGZvciB0aGU6XHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB0aGlzRnVuY3Rpb24gZnJvbSAnY2Mud2FpdC1mb3ItYW1tby1pbnN0YW50aWF0ZWQnO1xyXG4gKiBhd2FpdCB0aGlzRnVuY3Rpb24oKTtcclxuICogYGBgXHJcbiAqIGJlZm9yZSBgJ2NjLnBoeXNpY3MtYW1tbydgIGNhbiBiZSBpbXBvcnRlZDtcclxuICogQHBhcmFtIHdhc21CaW5hcnkgVGhlIC53YXNtIGZpbGUsIGlmIGFueS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yQW1tb0luc3RhbnRpYXRpb24gKHdhc21CaW5hcnk/OiBBcnJheUJ1ZmZlcikge1xyXG4gICAgLy8gYHRoaXNgIG5lZWRlZCBieSBhbW1vIGNsb3N1cmUuXHJcbiAgICBjb25zdCBhbW1vQ2xvc3VyZVRoaXM6IHsgQW1tbzogdHlwZW9mIGltcG9ydCgnQGNvY29zL2FtbW8nKSB9ID0geyB9IGFzIGFueTtcclxuICAgIGlmICh0eXBlb2Ygd2FzbUJpbmFyeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9lbXNjcmlwdGVuLm9yZy9kb2NzL2NvbXBpbGluZy9XZWJBc3NlbWJseS5odG1sI3dhc20tZmlsZXMtYW5kLWNvbXBpbGF0aW9uXHJcbiAgICAgICAgQW1tb1snd2FzbUJpbmFyeSddID0gd2FzbUJpbmFyeTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgKEFtbW9DbG9zdXJlIGFzIGFueSkuY2FsbChhbW1vQ2xvc3VyZVRoaXMsIEFtbW8pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSB3YWl0Rm9yQW1tb0luc3RhbnRpYXRpb24ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcnVlIGlmIHRoZSBgJ0Bjb2Nvcy9hbW1vJ2AgaXMgdGhlIFdlYkFzc2VtYmx5IGVkaXRpb24uXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBpc1dhc20gPSAnaXNXYXNtJyBpbiBBbW1vSnM7XHJcbn0iXX0=