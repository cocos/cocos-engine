export function helloGlue (Module) {
  // The Module object: Our interface to the outside world. We import
  // and export values on it. There are various ways Module can be used:
  // 1. Not defined. We create it here
  // 2. A function parameter, function(Module) { ..generated code.. }
  // 3. pre-run appended it, var Module = {}; ..generated code..
  // 4. External script tag defines var Module.
  // We need to check if Module already exists (e.g. case 3 above).
  // Substitution will be replaced with actual code on later stage of the build,
  // this way Closure Compiler will not mangle it (e.g. case 4. above).
  // Note that if you want to run closure, and also to use Module
  // after the generated code, you will need to define   var Module = {};
  // before the code. Then that object will be used in the code, and you
  // can continue to use Module afterwards as well.
  var Module = typeof Module !== 'undefined' ? Module : {};

  // --pre-jses are emitted after the Module integration code, so that they can
  // refer to Module (if they choose; they can also define Module)
  // {{PRE_JSES}}

  // Sometimes an existing Module object exists with properties
  // meant to overwrite the default module functionality. Here
  // we collect those properties and reapply _after_ we configure
  // the current environment's defaults to avoid having to be so
  // defensive during initialization.
  let moduleOverrides = {};
  let key;
  for (key in Module) {
    if (Module.hasOwnProperty(key)) {
      moduleOverrides[key] = Module[key];
    }
  }

  let arguments_ = [];
  let thisProgram = './this.program';
  let quit_ = function (status, toThrow) {
    throw toThrow;
  };

  // Determine the runtime environment we are in. You can customize this by
  // setting the ENVIRONMENT setting at compile time (see settings.js).

  // Attempt to auto-detect the environment
  const ENVIRONMENT_IS_WEB = typeof window === 'object';
  const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  // N.b. Electron.js environment is simultaneously a NODE-environment, but
  // also a web environment.
  const ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
  const ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

  if (Module.ENVIRONMENT) {
    throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
  }

  // `/` should be present at the end if `scriptDirectory` is not empty
  let scriptDirectory = '';
  function locateFile (path) {
    if (Module.locateFile) {
      return Module.locateFile(path, scriptDirectory);
    }
    return scriptDirectory + path;
  }

  // Hooks that are implemented differently in different runtime environments.
  let read_;
  let readAsync;
  let readBinary;
  let setWindowTitle;

  let nodeFS;
  let nodePath;

  if (ENVIRONMENT_IS_NODE) {
    if (!(typeof process === 'object' && typeof require === 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');
    if (ENVIRONMENT_IS_WORKER) {
      scriptDirectory = `${require('path').dirname(scriptDirectory)}/`;
    } else {
      scriptDirectory = `${__dirname}/`;
    }

    // include: node_shell_read.js

    read_ = function shell_read (filename, binary) {
      if (!nodeFS) nodeFS = require('fs');
      if (!nodePath) nodePath = require('path');
      filename = nodePath.normalize(filename);
      return nodeFS.readFileSync(filename, binary ? null : 'utf8');
    };

    readBinary = function readBinary (filename) {
      let ret = read_(filename, true);
      if (!ret.buffer) {
        ret = new Uint8Array(ret);
      }
      assert(ret.buffer);
      return ret;
    };

    readAsync = function readAsync (filename, onload, onerror) {
      if (!nodeFS) nodeFS = require('fs');
      if (!nodePath) nodePath = require('path');
      filename = nodePath.normalize(filename);
      nodeFS.readFile(filename, (err, data) => {
        if (err) onerror(err);
        else onload(data.buffer);
      });
    };

    // end include: node_shell_read.js
    if (process.argv.length > 1) {
      thisProgram = process.argv[1].replace(/\\/g, '/');
    }

    arguments_ = process.argv.slice(2);

    if (typeof module !== 'undefined') {
      module.exports = Module;
    }

    process.on('uncaughtException', (ex) => {
      // suppress ExitStatus exceptions from showing an error
      if (!(ex instanceof ExitStatus)) {
        throw ex;
      }
    });

    process.on('unhandledRejection', abort);

    quit_ = function (status, toThrow) {
      if (keepRuntimeAlive()) {
        process.exitCode = status;
        throw toThrow;
      }
      process.exit(status);
    };

    Module.inspect = function () { return '[Emscripten Module object]'; };
  } else
    if (ENVIRONMENT_IS_SHELL) {
      if ((typeof process === 'object' && typeof require === 'function') || typeof window === 'object' || typeof importScripts === 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

      if (typeof read !== 'undefined') {
        read_ = function shell_read (f) {
          return read(f);
        };
      }

      readBinary = function readBinary (f) {
        let data;
        if (typeof readbuffer === 'function') {
          return new Uint8Array(readbuffer(f));
        }
        data = read(f, 'binary');
        assert(typeof data === 'object');
        return data;
      };

      readAsync = function readAsync (f, onload, onerror) {
        setTimeout(() => { onload(readBinary(f)); }, 0);
      };

      if (typeof scriptArgs !== 'undefined') {
        arguments_ = scriptArgs;
      } else if (typeof arguments !== 'undefined') {
        arguments_ = arguments;
      }

      if (typeof quit === 'function') {
        quit_ = function (status) {
          quit(status);
        };
      }

      if (typeof print !== 'undefined') {
        // Prefer to use print/printErr where they exist, as they usually work better.
        if (typeof console === 'undefined') console = /** @type{!Console} */({});
        console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
        console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr !== 'undefined' ? printErr : print);
      }
    } else

      // Note that this includes Node.js workers when relevant (pthreads is enabled).
      // Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
      // ENVIRONMENT_IS_NODE.
      if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
          scriptDirectory = self.location.href;
        } else if (typeof document !== 'undefined' && document.currentScript) { // web
          scriptDirectory = document.currentScript.src;
        }
        // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
        // otherwise, slice off the final part of the url to find the script directory.
        // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
        // and scriptDirectory will correctly be replaced with an empty string.
        if (scriptDirectory.indexOf('blob:') !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/') + 1);
        } else {
          scriptDirectory = '';
        }

        if (!(typeof window === 'object' || typeof importScripts === 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

        // Differentiate the Web Worker from the Node Worker case, as reading must
        // be done differently.
        {
          // include: web_or_worker_shell_read.js

          read_ = function (url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            return xhr.responseText;
          };

          if (ENVIRONMENT_IS_WORKER) {
            readBinary = function (url) {
              const xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.responseType = 'arraybuffer';
              xhr.send(null);
              return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
            };
          }

          readAsync = function (url, onload, onerror) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
              if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
                onload(xhr.response);
                return;
              }
              onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
          };

          // end include: web_or_worker_shell_read.js
        }

        setWindowTitle = function (title) { document.title = title; };
      } else {
        throw new Error('environment detection error');
      }

  // Set up the out() and err() hooks, which are how we can print to stdout or
  // stderr, respectively.
  let out = Module.print || console.log.bind(console);
  let err = Module.printErr || console.warn.bind(console);

  // Merge back in the overrides
  for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
      Module[key] = moduleOverrides[key];
    }
  }
  // Free the object hierarchy contained in the overrides, this lets the GC
  // reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
  moduleOverrides = null;

  // Emit code to handle expected values on the Module object. This applies Module.x
  // to the proper local x. This has two benefits: first, we only emit it if it is
  // expected to arrive, and second, by using a local everywhere else that can be
  // minified.

  if (Module.arguments) arguments_ = Module.arguments;
  if (!Object.getOwnPropertyDescriptor(Module, 'arguments')) {
    Object.defineProperty(Module, 'arguments', {
      configurable: true,
      get () {
        abort('Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  if (Module.thisProgram) thisProgram = Module.thisProgram;
  if (!Object.getOwnPropertyDescriptor(Module, 'thisProgram')) {
    Object.defineProperty(Module, 'thisProgram', {
      configurable: true,
      get () {
        abort('Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  if (Module.quit) quit_ = Module.quit;
  if (!Object.getOwnPropertyDescriptor(Module, 'quit')) {
    Object.defineProperty(Module, 'quit', {
      configurable: true,
      get () {
        abort('Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  // perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module.memoryInitializerPrefixURL === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module.pthreadMainPrefixURL === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module.cdInitializerPrefixURL === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module.filePackagePrefixURL === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module.read === 'undefined', 'Module.read option was removed (modify read_ in JS)');
  assert(typeof Module.readAsync === 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
  assert(typeof Module.readBinary === 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
  assert(typeof Module.setWindowTitle === 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
  assert(typeof Module.TOTAL_MEMORY === 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');

  if (!Object.getOwnPropertyDescriptor(Module, 'read')) {
    Object.defineProperty(Module, 'read', {
      configurable: true,
      get () {
        abort('Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  if (!Object.getOwnPropertyDescriptor(Module, 'readAsync')) {
    Object.defineProperty(Module, 'readAsync', {
      configurable: true,
      get () {
        abort('Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  if (!Object.getOwnPropertyDescriptor(Module, 'readBinary')) {
    Object.defineProperty(Module, 'readBinary', {
      configurable: true,
      get () {
        abort('Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  if (!Object.getOwnPropertyDescriptor(Module, 'setWindowTitle')) {
    Object.defineProperty(Module, 'setWindowTitle', {
      configurable: true,
      get () {
        abort('Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }
  const IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
  const PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
  const WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
  const NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';
  function alignMemory () { abort('`alignMemory` is now a library function and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line'); }

  assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add \'shell\' to `-s ENVIRONMENT` to enable.');

  const STACK_ALIGN = 16;

  function getNativeTypeSize (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length - 1] === '*') {
          return 4; // A pointer
        } else if (type[0] === 'i') {
          const bits = Number(type.substr(1));
          assert(bits % 8 === 0, `getNativeTypeSize invalid bits ${bits}, type ${type}`);
          return bits / 8;
        } else {
          return 0;
        }
      }
    }
  }

  function warnOnce (text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
      warnOnce.shown[text] = 1;
      err(text);
    }
  }

  // include: runtime_functions.js

  // Wraps a JS function as a wasm function with a given signature.
  function convertJsFunctionToWasm (func, sig) {
    // If the type reflection proposal is available, use the new
    // "WebAssembly.Function" constructor.
    // Otherwise, construct a minimal wasm module importing the JS function and
    // re-exporting it.
    if (typeof WebAssembly.Function === 'function') {
      const typeNames = {
        i: 'i32',
        j: 'i64',
        f: 'f32',
        d: 'f64',
      };
      const type = {
        parameters: [],
        results: sig[0] == 'v' ? [] : [typeNames[sig[0]]],
      };
      for (var i = 1; i < sig.length; ++i) {
        type.parameters.push(typeNames[sig[i]]);
      }
      return new WebAssembly.Function(type, func);
    }

    // The module is static, with the exception of the type section, which is
    // generated based on the signature passed in.
    let typeSection = [
      0x01, // id: section,
      0x00, // length: 0 (placeholder)
      0x01, // count: 1
      0x60, // form: func
    ];
    const sigRet = sig.slice(0, 1);
    const sigParam = sig.slice(1);
    const typeCodes = {
      i: 0x7f, // i32
      j: 0x7e, // i64
      f: 0x7d, // f32
      d: 0x7c, // f64
    };

    // Parameters, length + signatures
    typeSection.push(sigParam.length);
    for (var i = 0; i < sigParam.length; ++i) {
      typeSection.push(typeCodes[sigParam[i]]);
    }

    // Return values, length + signatures
    // With no multi-return in MVP, either 0 (void) or 1 (anything else)
    if (sigRet == 'v') {
      typeSection.push(0x00);
    } else {
      typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
    }

    // Write the overall length of the type section back into the section header
    // (excepting the 2 bytes for the section id and length)
    typeSection[1] = typeSection.length - 2;

    // Rest of the module is static
    const bytes = new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
      0x01, 0x00, 0x00, 0x00, // version: 1
    ].concat(typeSection, [
      0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
      0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
    ]));

    // We can compile this wasm module synchronously because it is very small.
    // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
    const module = new WebAssembly.Module(bytes);
    const instance = new WebAssembly.Instance(module, {
      e: {
        f: func,
      },
    });
    const wrappedFunc = instance.exports.f;
    return wrappedFunc;
  }

  const freeTableIndexes = [];

  // Weak map of functions in the table to their indexes, created on first use.
  let functionsInTableMap;

  function getEmptyTableSlot () {
    // Reuse a free index if there is one, otherwise grow.
    if (freeTableIndexes.length) {
      return freeTableIndexes.pop();
    }
    // Grow the table
    try {
      wasmTable.grow(1);
    } catch (err) {
      if (!(err instanceof RangeError)) {
        throw err;
      }
      throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
    }
    return wasmTable.length - 1;
  }

  // Add a wasm function to the table.
  function addFunctionWasm (func, sig) {
    // Check if the function is already in the table, to ensure each function
    // gets a unique index. First, create the map if this is the first use.
    if (!functionsInTableMap) {
      functionsInTableMap = new WeakMap();
      for (let i = 0; i < wasmTable.length; i++) {
        const item = wasmTable.get(i);
        // Ignore null values.
        if (item) {
          functionsInTableMap.set(item, i);
        }
      }
    }
    if (functionsInTableMap.has(func)) {
      return functionsInTableMap.get(func);
    }

    // It's not in the table, add it now.

    const ret = getEmptyTableSlot();

    // Set the new value.
    try {
      // Attempting to call this with JS function will cause of table.set() to fail
      wasmTable.set(ret, func);
    } catch (err) {
      if (!(err instanceof TypeError)) {
        throw err;
      }
      assert(typeof sig !== 'undefined', `Missing signature argument to addFunction: ${func}`);
      const wrapped = convertJsFunctionToWasm(func, sig);
      wasmTable.set(ret, wrapped);
    }

    functionsInTableMap.set(func, ret);

    return ret;
  }

  function removeFunction (index) {
    functionsInTableMap.delete(wasmTable.get(index));
    freeTableIndexes.push(index);
  }

  // 'sig' parameter is required for the llvm backend but only when func is not
  // already a WebAssembly function.
  function addFunction (func, sig) {
    assert(typeof func !== 'undefined');

    return addFunctionWasm(func, sig);
  }

  // end include: runtime_functions.js
  // include: runtime_debug.js

  // end include: runtime_debug.js
  let tempRet0 = 0;

  const setTempRet0 = function (value) {
    tempRet0 = value;
  };

  const getTempRet0 = function () {
    return tempRet0;
  };

  // === Preamble library stuff ===

  // Documentation for the public APIs defined in this file must be updated in:
  //    site/source/docs/api_reference/preamble.js.rst
  // A prebuilt local version of the documentation is available at:
  //    site/build/text/docs/api_reference/preamble.js.txt
  // You can also build docs locally as HTML or other formats in site/
  // An online HTML version (which may be of a different version of Emscripten)
  //    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

  let wasmBinary;
  if (Module.wasmBinary) wasmBinary = Module.wasmBinary;
  if (!Object.getOwnPropertyDescriptor(Module, 'wasmBinary')) {
    Object.defineProperty(Module, 'wasmBinary', {
      configurable: true,
      get () {
        abort('Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }
  const noExitRuntime = Module.noExitRuntime || true;
  if (!Object.getOwnPropertyDescriptor(Module, 'noExitRuntime')) {
    Object.defineProperty(Module, 'noExitRuntime', {
      configurable: true,
      get () {
        abort('Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  if (typeof WebAssembly !== 'object') {
    abort('no native wasm support detected');
  }

  // include: runtime_safe_heap.js

  // In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
  // In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

  /** @param {number} ptr
  @param {number} value
  @param {string} type
  @param {number|boolean=} noSafe */
  function setValue (ptr, value, type, noSafe) {
    type = type || 'i8';
    if (type.charAt(type.length - 1) === '*') type = 'i32'; // pointers are 32-bit
    switch (type) {
      case 'i1': HEAP8[((ptr) >> 0)] = value; break;
      case 'i8': HEAP8[((ptr) >> 0)] = value; break;
      case 'i16': HEAP16[((ptr) >> 1)] = value; break;
      case 'i32': HEAP32[((ptr) >> 2)] = value; break;
      case 'i64': (tempI64 = [value >>> 0, (tempDouble = value, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[((ptr) >> 2)] = tempI64[0], HEAP32[(((ptr) + (4)) >> 2)] = tempI64[1]); break;
      case 'float': HEAPF32[((ptr) >> 2)] = value; break;
      case 'double': HEAPF64[((ptr) >> 3)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  /** @param {number} ptr
  @param {string} type
  @param {number|boolean=} noSafe */
  function getValue (ptr, type, noSafe) {
    type = type || 'i8';
    if (type.charAt(type.length - 1) === '*') type = 'i32'; // pointers are 32-bit
    switch (type) {
      case 'i1': return HEAP8[((ptr) >> 0)];
      case 'i8': return HEAP8[((ptr) >> 0)];
      case 'i16': return HEAP16[((ptr) >> 1)];
      case 'i32': return HEAP32[((ptr) >> 2)];
      case 'i64': return HEAP32[((ptr) >> 2)];
      case 'float': return HEAPF32[((ptr) >> 2)];
      case 'double': return HEAPF64[((ptr) >> 3)];
      default: abort(`invalid type for getValue: ${type}`);
    }
    return null;
  }

  // end include: runtime_safe_heap.js
  // Wasm globals

  let wasmMemory;

  //= =======================================
  // Runtime essentials
  //= =======================================

  // whether we are quitting the application. no code should run after this.
  // set in exit() and abort()
  let ABORT = false;

  // set by exit() and abort().  Passed to 'onExit' handler.
  // NOTE: This is also used as the process return code code in shell environments
  // but only when noExitRuntime is false.
  let EXITSTATUS;

  /** @type {function(*, string=)} */
  function assert (condition, text) {
    if (!condition) {
      abort(`Assertion failed: ${text}`);
    }
  }

  // Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
  function getCFunc (ident) {
    const func = Module[`_${ident}`]; // closure exported function
    assert(func, `Cannot call unknown function ${ident}, make sure it is exported`);
    return func;
  }

  // C calling interface.
  /** @param {string|null=} returnType
  @param {Array=} argTypes
  @param {Arguments|Array=} args
  @param {Object=} opts */
  function ccall (ident, returnType, argTypes, args, opts) {
    // For fast lookup of conversion functions
    const toC = {
      string (str) {
        let ret = 0;
        if (str !== null && str !== undefined && str !== 0) { // null string
          // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
          const len = (str.length << 2) + 1;
          ret = stackAlloc(len);
          stringToUTF8(str, ret, len);
        }
        return ret;
      },
      array (arr) {
        const ret = stackAlloc(arr.length);
        writeArrayToMemory(arr, ret);
        return ret;
      },
    };

    function convertReturnValue (ret) {
      if (returnType === 'string') return UTF8ToString(ret);
      if (returnType === 'boolean') return Boolean(ret);
      return ret;
    }

    const func = getCFunc(ident);
    const cArgs = [];
    let stack = 0;
    assert(returnType !== 'array', 'Return type should not be "array".');
    if (args) {
      for (let i = 0; i < args.length; i++) {
        const converter = toC[argTypes[i]];
        if (converter) {
          if (stack === 0) stack = stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }
    let ret = func.apply(null, cArgs);
    function onDone (ret) {
      if (stack !== 0) stackRestore(stack);
      return convertReturnValue(ret);
    }

    ret = onDone(ret);
    return ret;
  }

  /** @param {string=} returnType
  @param {Array=} argTypes
  @param {Object=} opts */
  function cwrap (ident, returnType, argTypes, opts) {
    return function () {
      return ccall(ident, returnType, argTypes, arguments, opts);
    };
  }

  // We used to include malloc/free by default in the past. Show a helpful error in
  // builds with assertions.

  const ALLOC_NORMAL = 0; // Tries to use _malloc()
  const ALLOC_STACK = 1; // Lives for the duration of the current function call

  // allocate(): This is for internal use. You can use it yourself as well, but the interface
  //             is a little tricky (see docs right below). The reason is that it is optimized
  //             for multiple syntaxes to save space in generated code. So you should
  //             normally not use allocate(), and instead allocate memory using _malloc(),
  //             initialize it with setValue(), and so forth.
  // @slab: An array of data.
  // @allocator: How to allocate memory, see ALLOC_*
  /** @type {function((Uint8Array|Array<number>), number)} */
  function allocate (slab, allocator) {
    let ret;
    assert(typeof allocator === 'number', 'allocate no longer takes a type argument');
    assert(typeof slab !== 'number', 'allocate no longer takes a number as arg0');

    if (allocator == ALLOC_STACK) {
      ret = stackAlloc(slab.length);
    } else {
      ret = _malloc(slab.length);
    }

    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */(slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  // include: runtime_strings.js

  // runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

  // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
  // a copy of that string as a Javascript String object.

  const UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

  /**
* @param {number} idx
* @param {number=} maxBytesToRead
* @return {string}
*/
  function UTF8ArrayToString (heap, idx, maxBytesToRead) {
    const endIdx = idx + maxBytesToRead;
    let endPtr = idx;
    // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
    // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
    // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
    while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
      return UTF8Decoder.decode(heap.subarray(idx, endPtr));
    } else {
      var str = '';
      // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        let u0 = heap[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        const u1 = heap[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        const u2 = heap[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce(`Invalid UTF-8 leading byte 0x${u0.toString(16)} encountered when deserializing a UTF-8 string in wasm memory to a JS string!`);
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
        }

        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          const ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
    }
    return str;
  }

  // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
  // copy of that string as a Javascript String object.
  // maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
  //                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
  //                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
  //                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
  //                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
  //                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
  //                 throw JS JIT optimizations off, so it is worth to consider consistently using one
  //                 style or the other.
  /**
* @param {number} ptr
* @param {number=} maxBytesToRead
* @return {string}
*/
  function UTF8ToString (ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
  }

  // Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
  // encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
  // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Parameters:
  //   str: the Javascript string to copy.
  //   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
  //   outIdx: The starting offset in the array to begin the copying.
  //   maxBytesToWrite: The maximum number of bytes this function can write to the array.
  //                    This count should include the null terminator,
  //                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
  //                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF8Array (str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    { return 0; }

    const startIdx = outIdx;
    const endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
    for (let i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
      let u = str.charCodeAt(i); // possibly a lead surrogate
      if (u >= 0xD800 && u <= 0xDFFF) {
        const u1 = str.charCodeAt(++i);
        u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
      }
      if (u <= 0x7F) {
        if (outIdx >= endIdx) break;
        heap[outIdx++] = u;
      } else if (u <= 0x7FF) {
        if (outIdx + 1 >= endIdx) break;
        heap[outIdx++] = 0xC0 | (u >> 6);
        heap[outIdx++] = 0x80 | (u & 63);
      } else if (u <= 0xFFFF) {
        if (outIdx + 2 >= endIdx) break;
        heap[outIdx++] = 0xE0 | (u >> 12);
        heap[outIdx++] = 0x80 | ((u >> 6) & 63);
        heap[outIdx++] = 0x80 | (u & 63);
      } else {
        if (outIdx + 3 >= endIdx) break;
        if (u >= 0x200000) warnOnce(`Invalid Unicode code point 0x${u.toString(16)} encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x1FFFFF).`);
        heap[outIdx++] = 0xF0 | (u >> 18);
        heap[outIdx++] = 0x80 | ((u >> 12) & 63);
        heap[outIdx++] = 0x80 | ((u >> 6) & 63);
        heap[outIdx++] = 0x80 | (u & 63);
      }
    }
    // Null-terminate the pointer to the buffer.
    heap[outIdx] = 0;
    return outIdx - startIdx;
  }

  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
  // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF8 (str, outPtr, maxBytesToWrite) {
    assert(typeof maxBytesToWrite === 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
  }

  // Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
  function lengthBytesUTF8 (str) {
    let len = 0;
    for (let i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      let u = str.charCodeAt(i); // possibly a lead surrogate
      if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
      if (u <= 0x7F) ++len;
      else if (u <= 0x7FF) len += 2;
      else if (u <= 0xFFFF) len += 3;
      else len += 4;
    }
    return len;
  }

  // end include: runtime_strings.js
  // include: runtime_strings_extra.js

  // runtime_strings_extra.js: Strings related runtime functions that are available only in regular runtime.

  // Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
  // a copy of that string as a Javascript String object.

  function AsciiToString (ptr) {
    let str = '';
    while (1) {
      const ch = HEAPU8[((ptr++) >> 0)];
      if (!ch) return str;
      str += String.fromCharCode(ch);
    }
  }

  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

  function stringToAscii (str, outPtr) {
    return writeAsciiToMemory(str, outPtr, false);
  }

  // Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
  // a copy of that string as a Javascript String object.

  const UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

  function UTF16ToString (ptr, maxBytesToRead) {
    assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
    let endPtr = ptr;
    // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
    // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
    let idx = endPtr >> 1;
    const maxIdx = idx + maxBytesToRead / 2;
    // If maxBytesToRead is not passed explicitly, it will be undefined, and this
    // will always evaluate to true. This saves on code size.
    while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
    endPtr = idx << 1;

    if (endPtr - ptr > 32 && UTF16Decoder) {
      return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
    } else {
      let str = '';

      // If maxBytesToRead is not passed explicitly, it will be undefined, and the for-loop's condition
      // will always evaluate to true. The loop is then terminated on the first null char.
      for (let i = 0; !(i >= maxBytesToRead / 2); ++i) {
        const codeUnit = HEAP16[(((ptr) + (i * 2)) >> 1)];
        if (codeUnit == 0) break;
        // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
        str += String.fromCharCode(codeUnit);
      }

      return str;
    }
  }

  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
  // Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Parameters:
  //   str: the Javascript string to copy.
  //   outPtr: Byte address in Emscripten HEAP where to write the string to.
  //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
  //                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
  //                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF16 (str, outPtr, maxBytesToWrite) {
    assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
    assert(typeof maxBytesToWrite === 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
    if (maxBytesToWrite === undefined) {
      maxBytesToWrite = 0x7FFFFFFF;
    }
    if (maxBytesToWrite < 2) return 0;
    maxBytesToWrite -= 2; // Null terminator.
    const startPtr = outPtr;
    const numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
    for (let i = 0; i < numCharsToWrite; ++i) {
      // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
      const codeUnit = str.charCodeAt(i); // possibly a lead surrogate
      HEAP16[((outPtr) >> 1)] = codeUnit;
      outPtr += 2;
    }
    // Null-terminate the pointer to the HEAP.
    HEAP16[((outPtr) >> 1)] = 0;
    return outPtr - startPtr;
  }

  // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

  function lengthBytesUTF16 (str) {
    return str.length * 2;
  }

  function UTF32ToString (ptr, maxBytesToRead) {
    assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
    let i = 0;

    let str = '';
    // If maxBytesToRead is not passed explicitly, it will be undefined, and this
    // will always evaluate to true. This saves on code size.
    while (!(i >= maxBytesToRead / 4)) {
      const utf32 = HEAP32[(((ptr) + (i * 4)) >> 2)];
      if (utf32 == 0) break;
      ++i;
      // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      if (utf32 >= 0x10000) {
        const ch = utf32 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      } else {
        str += String.fromCharCode(utf32);
      }
    }
    return str;
  }

  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
  // Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
  // Parameters:
  //   str: the Javascript string to copy.
  //   outPtr: Byte address in Emscripten HEAP where to write the string to.
  //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
  //                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
  //                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
  // Returns the number of bytes written, EXCLUDING the null terminator.

  function stringToUTF32 (str, outPtr, maxBytesToWrite) {
    assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
    assert(typeof maxBytesToWrite === 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
    if (maxBytesToWrite === undefined) {
      maxBytesToWrite = 0x7FFFFFFF;
    }
    if (maxBytesToWrite < 4) return 0;
    const startPtr = outPtr;
    const endPtr = startPtr + maxBytesToWrite - 4;
    for (let i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      let codeUnit = str.charCodeAt(i); // possibly a lead surrogate
      if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
        const trailSurrogate = str.charCodeAt(++i);
        codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
      }
      HEAP32[((outPtr) >> 2)] = codeUnit;
      outPtr += 4;
      if (outPtr + 4 > endPtr) break;
    }
    // Null-terminate the pointer to the HEAP.
    HEAP32[((outPtr) >> 2)] = 0;
    return outPtr - startPtr;
  }

  // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

  function lengthBytesUTF32 (str) {
    let len = 0;
    for (let i = 0; i < str.length; ++i) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
      // See http://unicode.org/faq/utf_bom.html#utf16-3
      const codeUnit = str.charCodeAt(i);
      if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
      len += 4;
    }

    return len;
  }

  // Allocate heap space for a JS string, and write it there.
  // It is the responsibility of the caller to free() that memory.
  function allocateUTF8 (str) {
    const size = lengthBytesUTF8(str) + 1;
    const ret = _malloc(size);
    if (ret) stringToUTF8Array(str, HEAP8, ret, size);
    return ret;
  }

  // Allocate stack space for a JS string, and write it there.
  function allocateUTF8OnStack (str) {
    const size = lengthBytesUTF8(str) + 1;
    const ret = stackAlloc(size);
    stringToUTF8Array(str, HEAP8, ret, size);
    return ret;
  }

  // Deprecated: This function should not be called because it is unsafe and does not provide
  // a maximum length limit of how many bytes it is allowed to write. Prefer calling the
  // function stringToUTF8Array() instead, which takes in a maximum length that can be used
  // to be secure from out of bounds writes.
  /** @deprecated
  @param {boolean=} dontAddNull */
  function writeStringToMemory (string, buffer, dontAddNull) {
    warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

    let /** @type {number} */ lastChar; /** @type {number} */ let end;
    if (dontAddNull) {
      // stringToUTF8Array always appends null. If we don't want to do that, remember the
      // character that existed at the location where the null will be placed, and restore
      // that after the write (below).
      end = buffer + lengthBytesUTF8(string);
      lastChar = HEAP8[end];
    }
    stringToUTF8(string, buffer, Infinity);
    if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
  }

  function writeArrayToMemory (array, buffer) {
    assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)');
    HEAP8.set(array, buffer);
  }

  /** @param {boolean=} dontAddNull */
  function writeAsciiToMemory (str, buffer, dontAddNull) {
    for (let i = 0; i < str.length; ++i) {
      assert(str.charCodeAt(i) === str.charCodeAt(i) & 0xff);
      HEAP8[((buffer++) >> 0)] = str.charCodeAt(i);
    }
    // Null-terminate the pointer to the HEAP.
    if (!dontAddNull) HEAP8[((buffer) >> 0)] = 0;
  }

  // end include: runtime_strings_extra.js
  // Memory management

  function alignUp (x, multiple) {
    if (x % multiple > 0) {
      x += multiple - (x % multiple);
    }
    return x;
  }

  let HEAP;
  /** @type {ArrayBuffer} */
  let buffer;
  /** @type {Int8Array} */
  let HEAP8;
  /** @type {Uint8Array} */
  let HEAPU8;
  /** @type {Int16Array} */
  let HEAP16;
  /** @type {Uint16Array} */
  let HEAPU16;
  /** @type {Int32Array} */
  let HEAP32;
  /** @type {Uint32Array} */
  let HEAPU32;
  /** @type {Float32Array} */
  let HEAPF32;
  /** @type {Float64Array} */
  let HEAPF64;

  function updateGlobalBufferAndViews (buf) {
    buffer = buf;
    Module.HEAP8 = HEAP8 = new Int8Array(buf);
    Module.HEAP16 = HEAP16 = new Int16Array(buf);
    Module.HEAP32 = HEAP32 = new Int32Array(buf);
    Module.HEAPU8 = HEAPU8 = new Uint8Array(buf);
    Module.HEAPU16 = HEAPU16 = new Uint16Array(buf);
    Module.HEAPU32 = HEAPU32 = new Uint32Array(buf);
    Module.HEAPF32 = HEAPF32 = new Float32Array(buf);
    Module.HEAPF64 = HEAPF64 = new Float64Array(buf);
  }

  const TOTAL_STACK = 5242880;
  if (Module.TOTAL_STACK) assert(TOTAL_STACK === Module.TOTAL_STACK, 'the stack size can no longer be determined at runtime');

  const INITIAL_MEMORY = Module.INITIAL_MEMORY || 16777216;
  if (!Object.getOwnPropertyDescriptor(Module, 'INITIAL_MEMORY')) {
    Object.defineProperty(Module, 'INITIAL_MEMORY', {
      configurable: true,
      get () {
        abort('Module.INITIAL_MEMORY has been replaced with plain INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      },
    });
  }

  assert(INITIAL_MEMORY >= TOTAL_STACK, `INITIAL_MEMORY should be larger than TOTAL_STACK, was ${INITIAL_MEMORY}! (TOTAL_STACK=${TOTAL_STACK})`);

  // check for full engine support (use string 'subarray' to avoid closure compiler confusion)
  assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
    'JS engine does not provide full typed array support');

  // If memory is defined in wasm, the user can't provide it.
  assert(!Module.wasmMemory, 'Use of `wasmMemory` detected.  Use -s IMPORTED_MEMORY to define wasmMemory externally');
  assert(INITIAL_MEMORY == 16777216, 'Detected runtime INITIAL_MEMORY setting.  Use -s IMPORTED_MEMORY to define wasmMemory dynamically');

  // include: runtime_init_table.js
  // In regular non-RELOCATABLE mode the table is exported
  // from the wasm module and this will be assigned once
  // the exports are available.
  let wasmTable;

  // end include: runtime_init_table.js
  // include: runtime_stack_check.js

  // Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
  function writeStackCookie () {
    const max = _emscripten_stack_get_end();
    assert((max & 3) == 0);
    // The stack grows downwards
    HEAPU32[(max >> 2) + 1] = 0x2135467;
    HEAPU32[(max >> 2) + 2] = 0x89BACDFE;
    // Also test the global address 0 for integrity.
    HEAP32[0] = 0x63736d65; /* 'emsc' */
  }

  function checkStackCookie () {
    if (ABORT) return;
    const max = _emscripten_stack_get_end();
    const cookie1 = HEAPU32[(max >> 2) + 1];
    const cookie2 = HEAPU32[(max >> 2) + 2];
    if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
      abort(`Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x${cookie2.toString(16)} ${cookie1.toString(16)}`);
    }
    // Also test the global address 0 for integrity.
    if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }

  // end include: runtime_stack_check.js
  // include: runtime_assertions.js

  // Endianness check
  (function () {
    const h16 = new Int16Array(1);
    const h8 = new Int8Array(h16.buffer);
    h16[0] = 0x6373;
    if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -s SUPPORT_BIG_ENDIAN=1 to bypass)';
  }());

  // end include: runtime_assertions.js
  const __ATPRERUN__ = []; // functions called before the runtime is initialized
  const __ATINIT__ = []; // functions called during startup
  const __ATEXIT__ = []; // functions called during shutdown
  const __ATPOSTRUN__ = []; // functions called after the main() is called

  let runtimeInitialized = false;
  let runtimeExited = false;
  const runtimeKeepaliveCounter = 0;

  function keepRuntimeAlive () {
    return noExitRuntime || runtimeKeepaliveCounter > 0;
  }

  function preRun () {
    if (Module.preRun) {
      if (typeof Module.preRun === 'function') Module.preRun = [Module.preRun];
      while (Module.preRun.length) {
        addOnPreRun(Module.preRun.shift());
      }
    }

    callRuntimeCallbacks(__ATPRERUN__);
  }

  function initRuntime () {
    checkStackCookie();
    assert(!runtimeInitialized);
    runtimeInitialized = true;

    callRuntimeCallbacks(__ATINIT__);
  }

  function exitRuntime () {
    checkStackCookie();
    runtimeExited = true;
  }

  function postRun () {
    checkStackCookie();

    if (Module.postRun) {
      if (typeof Module.postRun === 'function') Module.postRun = [Module.postRun];
      while (Module.postRun.length) {
        addOnPostRun(Module.postRun.shift());
      }
    }

    callRuntimeCallbacks(__ATPOSTRUN__);
  }

  function addOnPreRun (cb) {
    __ATPRERUN__.unshift(cb);
  }

  function addOnInit (cb) {
    __ATINIT__.unshift(cb);
  }

  function addOnExit (cb) {
  }

  function addOnPostRun (cb) {
    __ATPOSTRUN__.unshift(cb);
  }

  // include: runtime_math.js

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

  assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
  assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
  assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
  assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');

  // end include: runtime_math.js
  // A counter of dependencies for calling run(). If we need to
  // do asynchronous work before running, increment this and
  // decrement it. Incrementing must happen in a place like
  // Module.preRun (used by emcc to add file preloading).
  // Note that you can add dependencies in preRun, even though
  // it happens right before run - run will be postponed until
  // the dependencies are met.
  let runDependencies = 0;
  let runDependencyWatcher = null;
  let dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
  const runDependencyTracking = {};

  function getUniqueRunDependency (id) {
    const orig = id;
    while (1) {
      if (!runDependencyTracking[id]) return id;
      id = orig + Math.random();
    }
  }

  function addRunDependency (id) {
    runDependencies++;

    if (Module.monitorRunDependencies) {
      Module.monitorRunDependencies(runDependencies);
    }

    if (id) {
      assert(!runDependencyTracking[id]);
      runDependencyTracking[id] = 1;
      if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
        // Check for missing dependencies every few seconds
        runDependencyWatcher = setInterval(() => {
          if (ABORT) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
            return;
          }
          let shown = false;
          for (const dep in runDependencyTracking) {
            if (!shown) {
              shown = true;
              err('still waiting on run dependencies:');
            }
            err(`dependency: ${dep}`);
          }
          if (shown) {
            err('(end of list)');
          }
        }, 10000);
      }
    } else {
      err('warning: run dependency added without ID');
    }
  }

  function removeRunDependency (id) {
    runDependencies--;

    if (Module.monitorRunDependencies) {
      Module.monitorRunDependencies(runDependencies);
    }

    if (id) {
      assert(runDependencyTracking[id]);
      delete runDependencyTracking[id];
    } else {
      err('warning: run dependency removed without ID');
    }
    if (runDependencies == 0) {
      if (runDependencyWatcher !== null) {
        clearInterval(runDependencyWatcher);
        runDependencyWatcher = null;
      }
      if (dependenciesFulfilled) {
        const callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback(); // can add another dependenciesFulfilled
      }
    }
  }

  Module.preloadedImages = {}; // maps url to image data
  Module.preloadedAudios = {}; // maps url to audio data

  /** @param {string|number=} what */
  function abort (what) {
    if (Module.onAbort) {
      Module.onAbort(what);
    }

    what += '';
    err(what);

    ABORT = true;
    EXITSTATUS = 1;

    const output = `abort(${what}) at ${stackTrace()}`;
    what = output;

    // Use a wasm runtime error, because a JS error might be seen as a foreign
    // exception, which means we'd run destructors on it. We need the error to
    // simply make the program stop.
    const e = new WebAssembly.RuntimeError(what);

    // Throw the error whether or not MODULARIZE is set because abort is used
    // in code paths apart from instantiation where an exception is expected
    // to be thrown when abort is called.
    throw e;
  }

  // {{MEM_INITIALIZER}}

  // include: memoryprofiler.js

  // end include: memoryprofiler.js
  // show errors on likely calls to FS when it was not included
  var FS = {
    error () {
      abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1');
    },
    init () { FS.error(); },
    createDataFile () { FS.error(); },
    createPreloadedFile () { FS.error(); },
    createLazyFile () { FS.error(); },
    open () { FS.error(); },
    mkdev () { FS.error(); },
    registerDevice () { FS.error(); },
    analyzePath () { FS.error(); },
    loadFilesFromDB () { FS.error(); },

    ErrnoError: function ErrnoError () { FS.error(); },
  };
  Module.FS_createDataFile = FS.createDataFile;
  Module.FS_createPreloadedFile = FS.createPreloadedFile;

  // include: URIUtils.js

  // Prefix of data URIs emitted by SINGLE_FILE and related options.
  const dataURIPrefix = 'data:application/octet-stream;base64,';

  // Indicates whether filename is a base64 data URI.
  function isDataURI (filename) {
    // Prefix of data URIs emitted by SINGLE_FILE and related options.
    return filename.startsWith(dataURIPrefix);
  }

  // Indicates whether filename is delivered via file protocol (as opposed to http/https)
  function isFileURI (filename) {
    return filename.startsWith('file://');
  }

  // end include: URIUtils.js
  function createExportWrapper (name, fixedasm) {
    return function () {
      const displayName = name;
      let asm = fixedasm;
      if (!fixedasm) {
        asm = Module.asm;
      }
      assert(runtimeInitialized, `native function \`${displayName}\` called before runtime initialization`);
      assert(!runtimeExited, `native function \`${displayName}\` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)`);
      if (!asm[name]) {
        assert(asm[name], `exported native function \`${displayName}\` not found`);
      }
      return asm[name].apply(null, arguments);
    };
  }

  let wasmBinaryFile;
  wasmBinaryFile = 'helloWasm.wasm';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

  function getBinary (file) {
    try {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      if (readBinary) {
        return readBinary(file);
      } else {
        throw 'both async and sync fetching of the wasm failed';
      }
    } catch (err) {
      abort(err);
    }
  }

  function getBinaryPromise () {
    // If we don't have the binary yet, try to to load it asynchronously.
    // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
    // See https://github.com/github/fetch/pull/92#issuecomment-140665932
    // Cordova or Electron apps are typically loaded from a file:// url.
    // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
      if (typeof fetch === 'function'
        && !isFileURI(wasmBinaryFile)
      ) {
        return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then((response) => {
          if (!response.ok) {
            throw `failed to load wasm binary file at '${wasmBinaryFile}'`;
          }
          return response.arrayBuffer();
        }).catch(() => getBinary(wasmBinaryFile));
      } else if (readAsync) {
        // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
        return new Promise(((resolve, reject) => {
          readAsync(wasmBinaryFile, (response) => { resolve(new Uint8Array(/** @type{!ArrayBuffer} */(response))); }, reject);
        }));
      }
    }

    // Otherwise, getBinary should be able to get it synchronously
    return Promise.resolve().then(() => getBinary(wasmBinaryFile));
  }

  // Create the wasm instance.
  // Receives the wasm imports, returns the exports.
  function createWasm () {
    // prepare imports
    const info = {
      env: asmLibraryArg,
      wasi_snapshot_preview1: asmLibraryArg,
    };
    // Load the wasm module and create an instance of using native support in the JS engine.
    // handle a generated wasm instance, receiving its exports and
    // performing other necessary setup
    /** @param {WebAssembly.Module=} module */
    function receiveInstance (instance, module) {
      const exports = instance.exports;

      Module.asm = exports;

      wasmMemory = Module.asm.memory;
      assert(wasmMemory, 'memory not found in wasm exports');
      // This assertion doesn't hold when emscripten is run in --post-link
      // mode.
      // TODO(sbc): Read INITIAL_MEMORY out of the wasm file in post-link mode.
      // assert(wasmMemory.buffer.byteLength === 16777216);
      updateGlobalBufferAndViews(wasmMemory.buffer);

      wasmTable = Module.asm.__indirect_function_table;
      assert(wasmTable, 'table not found in wasm exports');

      addOnInit(Module.asm.__wasm_call_ctors);

      removeRunDependency('wasm-instantiate');
    }
    // we can't run yet (except in a pthread, where we have a custom sync instantiator)
    addRunDependency('wasm-instantiate');

    // Prefer streaming instantiation if available.
    // Async compilation can be confusing when an error on the page overwrites Module
    // (for example, if the order of elements is wrong, and the one defining Module is
    // later), so we save Module and check it later.
    let trueModule = Module;
    function receiveInstantiationResult (result) {
      // 'result' is a ResultObject object which has both the module and instance.
      // receiveInstance() will swap in the exports (to Module.asm) so they can be called
      assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
      trueModule = null;
      // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
      // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
      receiveInstance(result.instance);
    }

    function instantiateArrayBuffer (receiver) {
      return getBinaryPromise().then((binary) => {
        const result = WebAssembly.instantiate(binary, info);
        return result;
      }).then(receiver, (reason) => {
        err(`failed to asynchronously prepare wasm: ${reason}`);

        // Warn on some common problems.
        if (isFileURI(wasmBinaryFile)) {
          err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
        }
        abort(reason);
      });
    }

    function instantiateAsync () {
      if (!wasmBinary
        && typeof WebAssembly.instantiateStreaming === 'function'
        && !isDataURI(wasmBinaryFile)
        // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
        && !isFileURI(wasmBinaryFile)
        && typeof fetch === 'function') {
        return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then((response) => {
          const result = WebAssembly.instantiateStreaming(response, info);

          return result.then(
            receiveInstantiationResult,
            (reason) => {
              // We expect the most common failure cause to be a bad MIME type for the binary,
              // in which case falling back to ArrayBuffer instantiation should work.
              err(`wasm streaming compile failed: ${reason}`);
              err('falling back to ArrayBuffer instantiation');
              return instantiateArrayBuffer(receiveInstantiationResult);
            },
          );
        });
      } else {
        return instantiateArrayBuffer(receiveInstantiationResult);
      }
    }

    // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
    // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
    // to any other async startup actions they are performing.
    if (Module.instantiateWasm) {
      try {
        const exports = Module.instantiateWasm(info, receiveInstance);
        return exports;
      } catch (e) {
        err(`Module.instantiateWasm callback failed with error: ${e}`);
        return false;
      }
    }

    instantiateAsync();
    return {}; // no exports yet; we'll fill them in later
  }

  // Globals used by JS i64 conversions (see makeSetValue)
  let tempDouble;
  let tempI64;

  // === Body ===

  const ASM_CONSTS = {

  };

  function callRuntimeCallbacks (callbacks) {
    while (callbacks.length > 0) {
      const callback = callbacks.shift();
      if (typeof callback === 'function') {
        callback(Module); // Pass the module as the first argument.
        continue;
      }
      const func = callback.func;
      if (typeof func === 'number') {
        if (callback.arg === undefined) {
          wasmTable.get(func)();
        } else {
          wasmTable.get(func)(callback.arg);
        }
      } else {
        func(callback.arg === undefined ? null : callback.arg);
      }
    }
  }

  function demangle (func) {
    warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
    return func;
  }

  function demangleAll (text) {
    const regex = /\b_Z[\w\d_]+/g;
    return text.replace(regex,
      (x) => {
        const y = demangle(x);
        return x === y ? x : (`${y} [${x}]`);
      });
  }

  function jsStackTrace () {
    let error = new Error();
    if (!error.stack) {
      // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
      // so try that as a special-case.
      try {
        throw new Error();
      } catch (e) {
        error = e;
      }
      if (!error.stack) {
        return '(no stack trace available)';
      }
    }
    return error.stack.toString();
  }

  function stackTrace () {
    let js = jsStackTrace();
    if (Module.extraStackTrace) js += `\n${Module.extraStackTrace()}`;
    return demangleAll(js);
  }

  function __embind_register_bigint (primitiveType, name, size, minRange, maxRange) { }

  function getShiftFromSize (size) {
    switch (size) {
      case 1: return 0;
      case 2: return 1;
      case 4: return 2;
      case 8: return 3;
      default:
        throw new TypeError(`Unknown type size: ${size}`);
    }
  }

  function embind_init_charCodes () {
    const codes = new Array(256);
    for (let i = 0; i < 256; ++i) {
      codes[i] = String.fromCharCode(i);
    }
    embind_charCodes = codes;
  }
  var embind_charCodes = undefined;
  function readLatin1String (ptr) {
    let ret = '';
    let c = ptr;
    while (HEAPU8[c]) {
      ret += embind_charCodes[HEAPU8[c++]];
    }
    return ret;
  }

  const awaitingDependencies = {};

  const registeredTypes = {};

  const typeDependencies = {};

  const char_0 = 48;

  const char_9 = 57;
  function makeLegalFunctionName (name) {
    if (undefined === name) {
      return '_unknown';
    }
    name = name.replace(/[^a-zA-Z0-9_]/g, '$');
    const f = name.charCodeAt(0);
    if (f >= char_0 && f <= char_9) {
      return `_${name}`;
    } else {
      return name;
    }
  }
  function createNamedFunction (name, body) {
    name = makeLegalFunctionName(name);
    /* jshint evil:true */
    return new Function(
      'body',
      `return function ${name}() {\n`
      + `    "use strict";`
      + `    return body.apply(this, arguments);\n`
      + `};\n`,
    )(body);
  }
  function extendError (baseErrorType, errorName) {
    const errorClass = createNamedFunction(errorName, function (message) {
      this.name = errorName;
      this.message = message;

      const stack = (new Error(message)).stack;
      if (stack !== undefined) {
        this.stack = `${this.toString()}\n${stack.replace(/^Error(:[^\n]*)?\n/, '')}`;
      }
    });
    errorClass.prototype = Object.create(baseErrorType.prototype);
    errorClass.prototype.constructor = errorClass;
    errorClass.prototype.toString = function () {
      if (this.message === undefined) {
        return this.name;
      } else {
        return `${this.name}: ${this.message}`;
      }
    };

    return errorClass;
  }
  let BindingError;
  function throwBindingError (message) {
    throw new BindingError(message);
  }

  let InternalError;
  function throwInternalError (message) {
    throw new InternalError(message);
  }
  function whenDependentTypesAreResolved (myTypes, dependentTypes, getTypeConverters) {
    myTypes.forEach((type) => {
      typeDependencies[type] = dependentTypes;
    });

    function onComplete (typeConverters) {
      const myTypeConverters = getTypeConverters(typeConverters);
      if (myTypeConverters.length !== myTypes.length) {
        throwInternalError('Mismatched type converter count');
      }
      for (let i = 0; i < myTypes.length; ++i) {
        registerType(myTypes[i], myTypeConverters[i]);
      }
    }

    const typeConverters = new Array(dependentTypes.length);
    const unregisteredTypes = [];
    let registered = 0;
    dependentTypes.forEach((dt, i) => {
      if (registeredTypes.hasOwnProperty(dt)) {
        typeConverters[i] = registeredTypes[dt];
      } else {
        unregisteredTypes.push(dt);
        if (!awaitingDependencies.hasOwnProperty(dt)) {
          awaitingDependencies[dt] = [];
        }
        awaitingDependencies[dt].push(() => {
          typeConverters[i] = registeredTypes[dt];
          ++registered;
          if (registered === unregisteredTypes.length) {
            onComplete(typeConverters);
          }
        });
      }
    });
    if (unregisteredTypes.length === 0) {
      onComplete(typeConverters);
    }
  }
  /** @param {Object=} options */
  function registerType (rawType, registeredInstance, options) {
    options = options || {};

    if (!('argPackAdvance' in registeredInstance)) {
      throw new TypeError('registerType registeredInstance requires argPackAdvance');
    }

    const name = registeredInstance.name;
    if (!rawType) {
      throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
    }
    if (registeredTypes.hasOwnProperty(rawType)) {
      if (options.ignoreDuplicateRegistrations) {
        return;
      } else {
        throwBindingError(`Cannot register type '${name}' twice`);
      }
    }

    registeredTypes[rawType] = registeredInstance;
    delete typeDependencies[rawType];

    if (awaitingDependencies.hasOwnProperty(rawType)) {
      const callbacks = awaitingDependencies[rawType];
      delete awaitingDependencies[rawType];
      callbacks.forEach((cb) => {
        cb();
      });
    }
  }
  function __embind_register_bool (rawType, name, size, trueValue, falseValue) {
    const shift = getShiftFromSize(size);

    name = readLatin1String(name);
    registerType(rawType, {
      name,
      fromWireType (wt) {
        // ambiguous emscripten ABI: sometimes return values are
        // true or false, and sometimes integers (0 or 1)
        return !!wt;
      },
      toWireType (destructors, o) {
        return o ? trueValue : falseValue;
      },
      argPackAdvance: 8,
      readValueFromPointer (pointer) {
        // TODO: if heap is fixed (like in asm.js) this could be executed outside
        let heap;
        if (size === 1) {
          heap = HEAP8;
        } else if (size === 2) {
          heap = HEAP16;
        } else if (size === 4) {
          heap = HEAP32;
        } else {
          throw new TypeError(`Unknown boolean type size: ${name}`);
        }
        return this.fromWireType(heap[pointer >> shift]);
      },
      destructorFunction: null, // This type does not need a destructor
    });
  }

  function ClassHandle_isAliasOf (other) {
    if (!(this instanceof ClassHandle)) {
      return false;
    }
    if (!(other instanceof ClassHandle)) {
      return false;
    }

    let leftClass = this.$$.ptrType.registeredClass;
    let left = this.$$.ptr;
    let rightClass = other.$$.ptrType.registeredClass;
    let right = other.$$.ptr;

    while (leftClass.baseClass) {
      left = leftClass.upcast(left);
      leftClass = leftClass.baseClass;
    }

    while (rightClass.baseClass) {
      right = rightClass.upcast(right);
      rightClass = rightClass.baseClass;
    }

    return leftClass === rightClass && left === right;
  }

  function shallowCopyInternalPointer (o) {
    return {
      count: o.count,
      deleteScheduled: o.deleteScheduled,
      preservePointerOnDelete: o.preservePointerOnDelete,
      ptr: o.ptr,
      ptrType: o.ptrType,
      smartPtr: o.smartPtr,
      smartPtrType: o.smartPtrType,
    };
  }

  function throwInstanceAlreadyDeleted (obj) {
    function getInstanceTypeName (handle) {
      return handle.$$.ptrType.registeredClass.name;
    }
    throwBindingError(`${getInstanceTypeName(obj)} instance already deleted`);
  }

  let finalizationGroup = false;

  function detachFinalizer (handle) { }

  function runDestructor ($$) {
    if ($$.smartPtr) {
      $$.smartPtrType.rawDestructor($$.smartPtr);
    } else {
      $$.ptrType.registeredClass.rawDestructor($$.ptr);
    }
  }
  function releaseClassHandle ($$) {
    $$.count.value -= 1;
    const toDelete = $$.count.value === 0;
    if (toDelete) {
      runDestructor($$);
    }
  }
  function attachFinalizer (handle) {
    if (typeof FinalizationGroup === 'undefined') {
      attachFinalizer = function (handle) { return handle; };
      return handle;
    }
    // If the running environment has a FinalizationGroup (see
    // https://github.com/tc39/proposal-weakrefs), then attach finalizers
    // for class handles.  We check for the presence of FinalizationGroup
    // at run-time, not build-time.
    finalizationGroup = new FinalizationGroup(((iter) => {
      for (let result = iter.next(); !result.done; result = iter.next()) {
        const $$ = result.value;
        if (!$$.ptr) {
          console.warn(`object already deleted: ${$$.ptr}`);
        } else {
          releaseClassHandle($$);
        }
      }
    }));
    attachFinalizer = function (handle) {
      finalizationGroup.register(handle, handle.$$, handle.$$);
      return handle;
    };
    detachFinalizer = function (handle) {
      finalizationGroup.unregister(handle.$$);
    };
    return attachFinalizer(handle);
  }
  function ClassHandle_clone () {
    if (!this.$$.ptr) {
      throwInstanceAlreadyDeleted(this);
    }

    if (this.$$.preservePointerOnDelete) {
      this.$$.count.value += 1;
      return this;
    } else {
      const clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
        $$: {
          value: shallowCopyInternalPointer(this.$$),
        },
      }));

      clone.$$.count.value += 1;
      clone.$$.deleteScheduled = false;
      return clone;
    }
  }

  function ClassHandle_delete () {
    if (!this.$$.ptr) {
      throwInstanceAlreadyDeleted(this);
    }

    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
      throwBindingError('Object already scheduled for deletion');
    }

    detachFinalizer(this);
    releaseClassHandle(this.$$);

    if (!this.$$.preservePointerOnDelete) {
      this.$$.smartPtr = undefined;
      this.$$.ptr = undefined;
    }
  }

  function ClassHandle_isDeleted () {
    return !this.$$.ptr;
  }

  let delayFunction;

  const deletionQueue = [];

  function flushPendingDeletes () {
    while (deletionQueue.length) {
      const obj = deletionQueue.pop();
      obj.$$.deleteScheduled = false;
      obj.delete();
    }
  }
  function ClassHandle_deleteLater () {
    if (!this.$$.ptr) {
      throwInstanceAlreadyDeleted(this);
    }
    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
      throwBindingError('Object already scheduled for deletion');
    }
    deletionQueue.push(this);
    if (deletionQueue.length === 1 && delayFunction) {
      delayFunction(flushPendingDeletes);
    }
    this.$$.deleteScheduled = true;
    return this;
  }
  function init_ClassHandle () {
    ClassHandle.prototype.isAliasOf = ClassHandle_isAliasOf;
    ClassHandle.prototype.clone = ClassHandle_clone;
    ClassHandle.prototype.delete = ClassHandle_delete;
    ClassHandle.prototype.isDeleted = ClassHandle_isDeleted;
    ClassHandle.prototype.deleteLater = ClassHandle_deleteLater;
  }
  function ClassHandle () {
  }

  const registeredPointers = {};

  function ensureOverloadTable (proto, methodName, humanName) {
    if (undefined === proto[methodName].overloadTable) {
      const prevFunc = proto[methodName];
      // Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
      proto[methodName] = function () {
        // TODO This check can be removed in -O3 level "unsafe" optimizations.
        if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
          throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${arguments.length}) - expects one of (${proto[methodName].overloadTable})!`);
        }
        return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
      };
      // Move the previous function into the overload table.
      proto[methodName].overloadTable = [];
      proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
    }
  }
  /** @param {number=} numArguments */
  function exposePublicSymbol (name, value, numArguments) {
    if (Module.hasOwnProperty(name)) {
      if (undefined === numArguments || (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])) {
        throwBindingError(`Cannot register public name '${name}' twice`);
      }

      // We are exposing a function with the same name as an existing function. Create an overload table and a function selector
      // that routes between the two.
      ensureOverloadTable(Module, name, name);
      if (Module.hasOwnProperty(numArguments)) {
        throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
      }
      // Add the new function into the overload table.
      Module[name].overloadTable[numArguments] = value;
    } else {
      Module[name] = value;
      if (undefined !== numArguments) {
        Module[name].numArguments = numArguments;
      }
    }
  }

  /** @constructor */
  function RegisteredClass (
    name,
    constructor,
    instancePrototype,
    rawDestructor,
    baseClass,
    getActualType,
    upcast,
    downcast,
  ) {
    this.name = name;
    this.constructor = constructor;
    this.instancePrototype = instancePrototype;
    this.rawDestructor = rawDestructor;
    this.baseClass = baseClass;
    this.getActualType = getActualType;
    this.upcast = upcast;
    this.downcast = downcast;
    this.pureVirtualFunctions = [];
  }

  function upcastPointer (ptr, ptrClass, desiredClass) {
    while (ptrClass !== desiredClass) {
      if (!ptrClass.upcast) {
        throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
      }
      ptr = ptrClass.upcast(ptr);
      ptrClass = ptrClass.baseClass;
    }
    return ptr;
  }
  function constNoSmartPtrRawPointerToWireType (destructors, handle) {
    if (handle === null) {
      if (this.isReference) {
        throwBindingError(`null is not a valid ${this.name}`);
      }
      return 0;
    }

    if (!handle.$$) {
      throwBindingError(`Cannot pass "${_embind_repr(handle)}" as a ${this.name}`);
    }
    if (!handle.$$.ptr) {
      throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
    }
    const handleClass = handle.$$.ptrType.registeredClass;
    const ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    return ptr;
  }

  function genericPointerToWireType (destructors, handle) {
    let ptr;
    if (handle === null) {
      if (this.isReference) {
        throwBindingError(`null is not a valid ${this.name}`);
      }

      if (this.isSmartPointer) {
        ptr = this.rawConstructor();
        if (destructors !== null) {
          destructors.push(this.rawDestructor, ptr);
        }
        return ptr;
      } else {
        return 0;
      }
    }

    if (!handle.$$) {
      throwBindingError(`Cannot pass "${_embind_repr(handle)}" as a ${this.name}`);
    }
    if (!handle.$$.ptr) {
      throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
    }
    if (!this.isConst && handle.$$.ptrType.isConst) {
      throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
    }
    const handleClass = handle.$$.ptrType.registeredClass;
    ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

    if (this.isSmartPointer) {
      // TODO: this is not strictly true
      // We could support BY_EMVAL conversions from raw pointers to smart pointers
      // because the smart pointer can hold a reference to the handle
      if (undefined === handle.$$.smartPtr) {
        throwBindingError('Passing raw pointer to smart pointer is illegal');
      }

      switch (this.sharingPolicy) {
        case 0: // NONE
          // no upcasting
          if (handle.$$.smartPtrType === this) {
            ptr = handle.$$.smartPtr;
          } else {
            throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
          }
          break;

        case 1: // INTRUSIVE
          ptr = handle.$$.smartPtr;
          break;

        case 2: // BY_EMVAL
          if (handle.$$.smartPtrType === this) {
            ptr = handle.$$.smartPtr;
          } else {
            const clonedHandle = handle.clone();
            ptr = this.rawShare(
              ptr,
              __emval_register(() => {
                clonedHandle.delete();
              }),
            );
            if (destructors !== null) {
              destructors.push(this.rawDestructor, ptr);
            }
          }
          break;

        default:
          throwBindingError('Unsupporting sharing policy');
      }
    }
    return ptr;
  }

  function nonConstNoSmartPtrRawPointerToWireType (destructors, handle) {
    if (handle === null) {
      if (this.isReference) {
        throwBindingError(`null is not a valid ${this.name}`);
      }
      return 0;
    }

    if (!handle.$$) {
      throwBindingError(`Cannot pass "${_embind_repr(handle)}" as a ${this.name}`);
    }
    if (!handle.$$.ptr) {
      throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
    }
    if (handle.$$.ptrType.isConst) {
      throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
    }
    const handleClass = handle.$$.ptrType.registeredClass;
    const ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    return ptr;
  }

  function simpleReadValueFromPointer (pointer) {
    return this.fromWireType(HEAPU32[pointer >> 2]);
  }

  function RegisteredPointer_getPointee (ptr) {
    if (this.rawGetPointee) {
      ptr = this.rawGetPointee(ptr);
    }
    return ptr;
  }

  function RegisteredPointer_destructor (ptr) {
    if (this.rawDestructor) {
      this.rawDestructor(ptr);
    }
  }

  function RegisteredPointer_deleteObject (handle) {
    if (handle !== null) {
      handle.delete();
    }
  }

  function downcastPointer (ptr, ptrClass, desiredClass) {
    if (ptrClass === desiredClass) {
      return ptr;
    }
    if (undefined === desiredClass.baseClass) {
      return null; // no conversion
    }

    const rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
    if (rv === null) {
      return null;
    }
    return desiredClass.downcast(rv);
  }

  function getInheritedInstanceCount () {
    return Object.keys(registeredInstances).length;
  }

  function getLiveInheritedInstances () {
    const rv = [];
    for (const k in registeredInstances) {
      if (registeredInstances.hasOwnProperty(k)) {
        rv.push(registeredInstances[k]);
      }
    }
    return rv;
  }

  function setDelayFunction (fn) {
    delayFunction = fn;
    if (deletionQueue.length && delayFunction) {
      delayFunction(flushPendingDeletes);
    }
  }
  function init_embind () {
    Module.getInheritedInstanceCount = getInheritedInstanceCount;
    Module.getLiveInheritedInstances = getLiveInheritedInstances;
    Module.flushPendingDeletes = flushPendingDeletes;
    Module.setDelayFunction = setDelayFunction;
  }
  var registeredInstances = {};

  function getBasestPointer (class_, ptr) {
    if (ptr === undefined) {
      throwBindingError('ptr should not be undefined');
    }
    while (class_.baseClass) {
      ptr = class_.upcast(ptr);
      class_ = class_.baseClass;
    }
    return ptr;
  }
  function getInheritedInstance (class_, ptr) {
    ptr = getBasestPointer(class_, ptr);
    return registeredInstances[ptr];
  }

  function makeClassHandle (prototype, record) {
    if (!record.ptrType || !record.ptr) {
      throwInternalError('makeClassHandle requires ptr and ptrType');
    }
    const hasSmartPtrType = !!record.smartPtrType;
    const hasSmartPtr = !!record.smartPtr;
    if (hasSmartPtrType !== hasSmartPtr) {
      throwInternalError('Both smartPtrType and smartPtr must be specified');
    }
    record.count = { value: 1 };
    return attachFinalizer(Object.create(prototype, {
      $$: {
        value: record,
      },
    }));
  }
  function RegisteredPointer_fromWireType (ptr) {
    // ptr is a raw pointer (or a raw smartpointer)

    // rawPointer is a maybe-null raw pointer
    const rawPointer = this.getPointee(ptr);
    if (!rawPointer) {
      this.destructor(ptr);
      return null;
    }

    const registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
    if (undefined !== registeredInstance) {
      // JS object has been neutered, time to repopulate it
      if (registeredInstance.$$.count.value === 0) {
        registeredInstance.$$.ptr = rawPointer;
        registeredInstance.$$.smartPtr = ptr;
        return registeredInstance.clone();
      } else {
        // else, just increment reference count on existing object
        // it already has a reference to the smart pointer
        const rv = registeredInstance.clone();
        this.destructor(ptr);
        return rv;
      }
    }

    function makeDefaultHandle () {
      if (this.isSmartPointer) {
        return makeClassHandle(this.registeredClass.instancePrototype, {
          ptrType: this.pointeeType,
          ptr: rawPointer,
          smartPtrType: this,
          smartPtr: ptr,
        });
      } else {
        return makeClassHandle(this.registeredClass.instancePrototype, {
          ptrType: this,
          ptr,
        });
      }
    }

    const actualType = this.registeredClass.getActualType(rawPointer);
    const registeredPointerRecord = registeredPointers[actualType];
    if (!registeredPointerRecord) {
      return makeDefaultHandle.call(this);
    }

    let toType;
    if (this.isConst) {
      toType = registeredPointerRecord.constPointerType;
    } else {
      toType = registeredPointerRecord.pointerType;
    }
    const dp = downcastPointer(
      rawPointer,
      this.registeredClass,
      toType.registeredClass,
    );
    if (dp === null) {
      return makeDefaultHandle.call(this);
    }
    if (this.isSmartPointer) {
      return makeClassHandle(toType.registeredClass.instancePrototype, {
        ptrType: toType,
        ptr: dp,
        smartPtrType: this,
        smartPtr: ptr,
      });
    } else {
      return makeClassHandle(toType.registeredClass.instancePrototype, {
        ptrType: toType,
        ptr: dp,
      });
    }
  }
  function init_RegisteredPointer () {
    RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
    RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
    RegisteredPointer.prototype.argPackAdvance = 8;
    RegisteredPointer.prototype.readValueFromPointer = simpleReadValueFromPointer;
    RegisteredPointer.prototype.deleteObject = RegisteredPointer_deleteObject;
    RegisteredPointer.prototype.fromWireType = RegisteredPointer_fromWireType;
  }
  /** @constructor
    @param {*=} pointeeType,
    @param {*=} sharingPolicy,
    @param {*=} rawGetPointee,
    @param {*=} rawConstructor,
    @param {*=} rawShare,
    @param {*=} rawDestructor,
     */
  function RegisteredPointer (
    name,
    registeredClass,
    isReference,
    isConst,

    // smart pointer properties
    isSmartPointer,
    pointeeType,
    sharingPolicy,
    rawGetPointee,
    rawConstructor,
    rawShare,
    rawDestructor,
  ) {
    this.name = name;
    this.registeredClass = registeredClass;
    this.isReference = isReference;
    this.isConst = isConst;

    // smart pointer properties
    this.isSmartPointer = isSmartPointer;
    this.pointeeType = pointeeType;
    this.sharingPolicy = sharingPolicy;
    this.rawGetPointee = rawGetPointee;
    this.rawConstructor = rawConstructor;
    this.rawShare = rawShare;
    this.rawDestructor = rawDestructor;

    if (!isSmartPointer && registeredClass.baseClass === undefined) {
      if (isConst) {
        this.toWireType = constNoSmartPtrRawPointerToWireType;
        this.destructorFunction = null;
      } else {
        this.toWireType = nonConstNoSmartPtrRawPointerToWireType;
        this.destructorFunction = null;
      }
    } else {
      this.toWireType = genericPointerToWireType;
      // Here we must leave this.destructorFunction undefined, since whether genericPointerToWireType returns
      // a pointer that needs to be freed up is runtime-dependent, and cannot be evaluated at registration time.
      // TODO: Create an alternative mechanism that allows removing the use of var destructors = []; array in
      //       craftInvokerFunction altogether.
    }
  }

  /** @param {number=} numArguments */
  function replacePublicSymbol (name, value, numArguments) {
    if (!Module.hasOwnProperty(name)) {
      throwInternalError('Replacing nonexistant public symbol');
    }
    // If there's an overload table for this symbol, replace the symbol in the overload table instead.
    if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
      Module[name].overloadTable[numArguments] = value;
    } else {
      Module[name] = value;
      Module[name].argCount = numArguments;
    }
  }

  function dynCallLegacy (sig, ptr, args) {
    assert((`dynCall_${sig}`) in Module, `bad function pointer type - no table for sig '${sig}'`);
    if (args && args.length) {
      // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
      assert(args.length === sig.substring(1).replace(/j/g, '--').length);
    } else {
      assert(sig.length == 1);
    }
    const f = Module[`dynCall_${sig}`];
    return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
  }
  function dynCall (sig, ptr, args) {
    // Without WASM_BIGINT support we cannot directly call function with i64 as
    // part of thier signature, so we rely the dynCall functions generated by
    // wasm-emscripten-finalize
    if (sig.includes('j')) {
      return dynCallLegacy(sig, ptr, args);
    }
    assert(wasmTable.get(ptr), `missing table entry in dynCall: ${ptr}`);
    return wasmTable.get(ptr).apply(null, args);
  }
  function getDynCaller (sig, ptr) {
    assert(sig.includes('j'), 'getDynCaller should only be called with i64 sigs');
    const argCache = [];
    return function () {
      argCache.length = arguments.length;
      for (let i = 0; i < arguments.length; i++) {
        argCache[i] = arguments[i];
      }
      return dynCall(sig, ptr, argCache);
    };
  }
  function embind__requireFunction (signature, rawFunction) {
    signature = readLatin1String(signature);

    function makeDynCaller () {
      if (signature.includes('j')) {
        return getDynCaller(signature, rawFunction);
      }
      return wasmTable.get(rawFunction);
    }

    const fp = makeDynCaller();
    if (typeof fp !== 'function') {
      throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
    }
    return fp;
  }

  let UnboundTypeError;

  function getTypeName (type) {
    const ptr = ___getTypeName(type);
    const rv = readLatin1String(ptr);
    _free(ptr);
    return rv;
  }
  function throwUnboundTypeError (message, types) {
    const unboundTypes = [];
    const seen = {};
    function visit (type) {
      if (seen[type]) {
        return;
      }
      if (registeredTypes[type]) {
        return;
      }
      if (typeDependencies[type]) {
        typeDependencies[type].forEach(visit);
        return;
      }
      unboundTypes.push(type);
      seen[type] = true;
    }
    types.forEach(visit);

    throw new UnboundTypeError(`${message}: ${unboundTypes.map(getTypeName).join([', '])}`);
  }
  function __embind_register_class (
    rawType,
    rawPointerType,
    rawConstPointerType,
    baseClassRawType,
    getActualTypeSignature,
    getActualType,
    upcastSignature,
    upcast,
    downcastSignature,
    downcast,
    name,
    destructorSignature,
    rawDestructor,
  ) {
    name = readLatin1String(name);
    getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
    if (upcast) {
      upcast = embind__requireFunction(upcastSignature, upcast);
    }
    if (downcast) {
      downcast = embind__requireFunction(downcastSignature, downcast);
    }
    rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
    const legalFunctionName = makeLegalFunctionName(name);

    exposePublicSymbol(legalFunctionName, () => {
      // this code cannot run if baseClassRawType is zero
      throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
    });

    whenDependentTypesAreResolved(
      [rawType, rawPointerType, rawConstPointerType],
      baseClassRawType ? [baseClassRawType] : [],
      (base) => {
        base = base[0];

        let baseClass;
        let basePrototype;
        if (baseClassRawType) {
          baseClass = base.registeredClass;
          basePrototype = baseClass.instancePrototype;
        } else {
          basePrototype = ClassHandle.prototype;
        }

        const constructor = createNamedFunction(legalFunctionName, function () {
          if (Object.getPrototypeOf(this) !== instancePrototype) {
            throw new BindingError(`Use 'new' to construct ${name}`);
          }
          if (undefined === registeredClass.constructor_body) {
            throw new BindingError(`${name} has no accessible constructor`);
          }
          const body = registeredClass.constructor_body[arguments.length];
          if (undefined === body) {
            throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
          }
          return body.apply(this, arguments);
        });

        var instancePrototype = Object.create(basePrototype, {
          constructor: { value: constructor },
        });

        constructor.prototype = instancePrototype;

        var registeredClass = new RegisteredClass(
          name,
          constructor,
          instancePrototype,
          rawDestructor,
          baseClass,
          getActualType,
          upcast,
          downcast,
        );

        const referenceConverter = new RegisteredPointer(
          name,
          registeredClass,
          true,
          false,
          false,
        );

        const pointerConverter = new RegisteredPointer(
          `${name}*`,
          registeredClass,
          false,
          false,
          false,
        );

        const constPointerConverter = new RegisteredPointer(
          `${name} const*`,
          registeredClass,
          false,
          true,
          false,
        );

        registeredPointers[rawType] = {
          pointerType: pointerConverter,
          constPointerType: constPointerConverter,
        };

        replacePublicSymbol(legalFunctionName, constructor);

        return [referenceConverter, pointerConverter, constPointerConverter];
      },
    );
  }

  function heap32VectorToArray (count, firstElement) {
    const array = [];
    for (let i = 0; i < count; i++) {
      array.push(HEAP32[(firstElement >> 2) + i]);
    }
    return array;
  }

  function runDestructors (destructors) {
    while (destructors.length) {
      const ptr = destructors.pop();
      const del = destructors.pop();
      del(ptr);
    }
  }
  function __embind_register_class_constructor (
    rawClassType,
    argCount,
    rawArgTypesAddr,
    invokerSignature,
    invoker,
    rawConstructor,
  ) {
    assert(argCount > 0);
    const rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
    invoker = embind__requireFunction(invokerSignature, invoker);
    const args = [rawConstructor];
    const destructors = [];

    whenDependentTypesAreResolved([], [rawClassType], (classType) => {
      classType = classType[0];
      const humanName = `constructor ${classType.name}`;

      if (undefined === classType.registeredClass.constructor_body) {
        classType.registeredClass.constructor_body = [];
      }
      if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
        throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
      }
      classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler () {
        throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
      };

      whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
        // Insert empty slot for context type (argTypes[1]).
        argTypes.splice(1, 0, null);
        classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
        return [];
      });
      return [];
    });
  }

  function new_ (constructor, argumentList) {
    if (!(constructor instanceof Function)) {
      throw new TypeError(`new_ called with constructor type ${typeof (constructor)} which is not a function`);
    }

    /*
   * Previously, the following line was just:

   function dummy() {};

   * Unfortunately, Chrome was preserving 'dummy' as the object's name, even though at creation, the 'dummy' has the
   * correct constructor name.  Thus, objects created with IMVU.new would show up in the debugger as 'dummy', which
   * isn't very helpful.  Using IMVU.createNamedFunction addresses the issue.  Doublely-unfortunately, there's no way
   * to write a test for this behavior.  -NRD 2013.02.22
   */
    const dummy = createNamedFunction(constructor.name || 'unknownFunctionName', () => { });
    dummy.prototype = constructor.prototype;
    const obj = new dummy();

    const r = constructor.apply(obj, argumentList);
    return (r instanceof Object) ? r : obj;
  }
  function craftInvokerFunction (humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
    // humanName: a human-readable string name for the function to be generated.
    // argTypes: An array that contains the embind type objects for all types in the function signature.
    //    argTypes[0] is the type object for the function return value.
    //    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
    //    argTypes[2...] are the actual function parameters.
    // classType: The embind type object for the class to be bound, or null if this is not a method of a class.
    // cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
    // cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
    const argCount = argTypes.length;

    if (argCount < 2) {
      throwBindingError('argTypes array size mismatch! Must at least get return value and \'this\' types!');
    }

    const isClassMethodFunc = (argTypes[1] !== null && classType !== null);

    // Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
    // TODO: This omits argument count check - enable only at -O3 or similar.
    //    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
    //       return FUNCTION_TABLE[fn];
    //    }

    // Determine if we need to use a dynamic stack to store the destructors for the function parameters.
    // TODO: Remove this completely once all function invokers are being dynamically generated.
    let needsDestructorStack = false;

    for (var i = 1; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here.
      if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) { // The type does not define a destructor function - must use dynamic stack
        needsDestructorStack = true;
        break;
      }
    }

    const returns = (argTypes[0].name !== 'void');

    let argsList = '';
    let argsListWired = '';
    for (var i = 0; i < argCount - 2; ++i) {
      argsList += `${i !== 0 ? ', ' : ''}arg${i}`;
      argsListWired += `${i !== 0 ? ', ' : ''}arg${i}Wired`;
    }

    let invokerFnBody = `return function ${makeLegalFunctionName(humanName)}(${argsList}) {\n`
      + `if (arguments.length !== ${argCount - 2}) {\n`
      + `throwBindingError('function ${humanName} called with ' + arguments.length + ' arguments, expected ${argCount - 2} args!');\n`
      + `}\n`;

    if (needsDestructorStack) {
      invokerFnBody
        += 'var destructors = [];\n';
    }

    const dtorStack = needsDestructorStack ? 'destructors' : 'null';
    const args1 = ['throwBindingError', 'invoker', 'fn', 'runDestructors', 'retType', 'classParam'];
    const args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];

    if (isClassMethodFunc) {
      invokerFnBody += `var thisWired = classParam.toWireType(${dtorStack}, this);\n`;
    }

    for (var i = 0; i < argCount - 2; ++i) {
      invokerFnBody += `var arg${i}Wired = argType${i}.toWireType(${dtorStack}, arg${i}); // ${argTypes[i + 2].name}\n`;
      args1.push(`argType${i}`);
      args2.push(argTypes[i + 2]);
    }

    if (isClassMethodFunc) {
      argsListWired = `thisWired${argsListWired.length > 0 ? ', ' : ''}${argsListWired}`;
    }

    invokerFnBody
      += `${returns ? 'var rv = ' : ''}invoker(fn${argsListWired.length > 0 ? ', ' : ''}${argsListWired});\n`;

    if (needsDestructorStack) {
      invokerFnBody += 'runDestructors(destructors);\n';
    } else {
      for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
        const paramName = (i === 1 ? 'thisWired' : (`arg${i - 2}Wired`));
        if (argTypes[i].destructorFunction !== null) {
          invokerFnBody += `${paramName}_dtor(${paramName}); // ${argTypes[i].name}\n`;
          args1.push(`${paramName}_dtor`);
          args2.push(argTypes[i].destructorFunction);
        }
      }
    }

    if (returns) {
      invokerFnBody += 'var ret = retType.fromWireType(rv);\n'
        + 'return ret;\n';
    } else {
    }

    invokerFnBody += '}\n';

    args1.push(invokerFnBody);

    const invokerFunction = new_(Function, args1).apply(null, args2);
    return invokerFunction;
  }
  function __embind_register_class_function (
    rawClassType,
    methodName,
    argCount,
    rawArgTypesAddr, // [ReturnType, ThisType, Args...]
    invokerSignature,
    rawInvoker,
    context,
    isPureVirtual,
  ) {
    const rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
    methodName = readLatin1String(methodName);
    rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);

    whenDependentTypesAreResolved([], [rawClassType], (classType) => {
      classType = classType[0];
      const humanName = `${classType.name}.${methodName}`;

      if (methodName.startsWith('@@')) {
        methodName = Symbol[methodName.substring(2)];
      }

      if (isPureVirtual) {
        classType.registeredClass.pureVirtualFunctions.push(methodName);
      }

      function unboundTypesHandler () {
        throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
      }

      const proto = classType.registeredClass.instancePrototype;
      const method = proto[methodName];
      if (undefined === method || (undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2)) {
        // This is the first overload to be registered, OR we are replacing a function in the base class with a function in the derived class.
        unboundTypesHandler.argCount = argCount - 2;
        unboundTypesHandler.className = classType.name;
        proto[methodName] = unboundTypesHandler;
      } else {
        // There was an existing function with the same name registered. Set up a function overload routing table.
        ensureOverloadTable(proto, methodName, humanName);
        proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
      }

      whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
        const memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);

        // Replace the initial unbound-handler-stub function with the appropriate member function, now that all types
        // are resolved. If multiple overloads are registered for this function, the function goes into an overload table.
        if (undefined === proto[methodName].overloadTable) {
          // Set argCount in case an overload is registered later
          memberFunction.argCount = argCount - 2;
          proto[methodName] = memberFunction;
        } else {
          proto[methodName].overloadTable[argCount - 2] = memberFunction;
        }

        return [];
      });
      return [];
    });
  }

  const emval_free_list = [];

  const emval_handle_array = [{}, { value: undefined }, { value: null }, { value: true }, { value: false }];
  function __emval_decref (handle) {
    if (handle > 4 && --emval_handle_array[handle].refcount === 0) {
      emval_handle_array[handle] = undefined;
      emval_free_list.push(handle);
    }
  }

  function count_emval_handles () {
    let count = 0;
    for (let i = 5; i < emval_handle_array.length; ++i) {
      if (emval_handle_array[i] !== undefined) {
        ++count;
      }
    }
    return count;
  }

  function get_first_emval () {
    for (let i = 5; i < emval_handle_array.length; ++i) {
      if (emval_handle_array[i] !== undefined) {
        return emval_handle_array[i];
      }
    }
    return null;
  }
  function init_emval () {
    Module.count_emval_handles = count_emval_handles;
    Module.get_first_emval = get_first_emval;
  }
  function __emval_register (value) {
    switch (value) {
      case undefined: { return 1; }
      case null: { return 2; }
      case true: { return 3; }
      case false: { return 4; }
      default: {
        const handle = emval_free_list.length
          ? emval_free_list.pop()
          : emval_handle_array.length;

        emval_handle_array[handle] = { refcount: 1, value };
        return handle;
      }
    }
  }
  function __embind_register_emval (rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
      name,
      fromWireType (handle) {
        const rv = emval_handle_array[handle].value;
        __emval_decref(handle);
        return rv;
      },
      toWireType (destructors, value) {
        return __emval_register(value);
      },
      argPackAdvance: 8,
      readValueFromPointer: simpleReadValueFromPointer,
      destructorFunction: null, // This type does not need a destructor

      // TODO: do we need a deleteObject here?  write a test where
      // emval is passed into JS via an interface
    });
  }

  function _embind_repr (v) {
    if (v === null) {
      return 'null';
    }
    const t = typeof v;
    if (t === 'object' || t === 'array' || t === 'function') {
      return v.toString();
    } else {
      return `${v}`;
    }
  }

  function floatReadValueFromPointer (name, shift) {
    switch (shift) {
      case 2: return function (pointer) {
        return this.fromWireType(HEAPF32[pointer >> 2]);
      };
      case 3: return function (pointer) {
        return this.fromWireType(HEAPF64[pointer >> 3]);
      };
      default:
        throw new TypeError(`Unknown float type: ${name}`);
    }
  }
  function __embind_register_float (rawType, name, size) {
    const shift = getShiftFromSize(size);
    name = readLatin1String(name);
    registerType(rawType, {
      name,
      fromWireType (value) {
        return value;
      },
      toWireType (destructors, value) {
        // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
        // avoid the following if() and assume value is of proper type.
        if (typeof value !== 'number' && typeof value !== 'boolean') {
          throw new TypeError(`Cannot convert "${_embind_repr(value)}" to ${this.name}`);
        }
        return value;
      },
      argPackAdvance: 8,
      readValueFromPointer: floatReadValueFromPointer(name, shift),
      destructorFunction: null, // This type does not need a destructor
    });
  }

  function integerReadValueFromPointer (name, shift, signed) {
    // integers are quite common, so generate very specialized functions
    switch (shift) {
      case 0: return signed
        ? function readS8FromPointer (pointer) { return HEAP8[pointer]; }
        : function readU8FromPointer (pointer) { return HEAPU8[pointer]; };
      case 1: return signed
        ? function readS16FromPointer (pointer) { return HEAP16[pointer >> 1]; }
        : function readU16FromPointer (pointer) { return HEAPU16[pointer >> 1]; };
      case 2: return signed
        ? function readS32FromPointer (pointer) { return HEAP32[pointer >> 2]; }
        : function readU32FromPointer (pointer) { return HEAPU32[pointer >> 2]; };
      default:
        throw new TypeError(`Unknown integer type: ${name}`);
    }
  }
  function __embind_register_integer (primitiveType, name, size, minRange, maxRange) {
    name = readLatin1String(name);
    if (maxRange === -1) { // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come out as 'i32 -1'. Always treat those as max u32.
      maxRange = 4294967295;
    }

    const shift = getShiftFromSize(size);

    let fromWireType = function (value) {
      return value;
    };

    if (minRange === 0) {
      const bitshift = 32 - 8 * size;
      fromWireType = function (value) {
        return (value << bitshift) >>> bitshift;
      };
    }

    const isUnsignedType = (name.includes('unsigned'));

    registerType(primitiveType, {
      name,
      fromWireType,
      toWireType (destructors, value) {
        // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
        // avoid the following two if()s and assume value is of proper type.
        if (typeof value !== 'number' && typeof value !== 'boolean') {
          throw new TypeError(`Cannot convert "${_embind_repr(value)}" to ${this.name}`);
        }
        if (value < minRange || value > maxRange) {
          throw new TypeError(`Passing a number "${_embind_repr(value)}" from JS side to C/C++ side to an argument of type "${name}", which is outside the valid range [${minRange}, ${maxRange}]!`);
        }
        return isUnsignedType ? (value >>> 0) : (value | 0);
      },
      argPackAdvance: 8,
      readValueFromPointer: integerReadValueFromPointer(name, shift, minRange !== 0),
      destructorFunction: null, // This type does not need a destructor
    });
  }

  function __embind_register_memory_view (rawType, dataTypeIndex, name) {
    const typeMapping = [
      Int8Array,
      Uint8Array,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
    ];

    const TA = typeMapping[dataTypeIndex];

    function decodeMemoryView (handle) {
      handle >>= 2;
      const heap = HEAPU32;
      const size = heap[handle]; // in elements
      const data = heap[handle + 1]; // byte offset into emscripten heap
      return new TA(buffer, data, size);
    }

    name = readLatin1String(name);
    registerType(rawType, {
      name,
      fromWireType: decodeMemoryView,
      argPackAdvance: 8,
      readValueFromPointer: decodeMemoryView,
    }, {
      ignoreDuplicateRegistrations: true,
    });
  }

  function __embind_register_std_string (rawType, name) {
    name = readLatin1String(name);
    const stdStringIsUTF8
      // process only std::string bindings with UTF8 support, in contrast to e.g. std::basic_string<unsigned char>
      = (name === 'std::string');

    registerType(rawType, {
      name,
      fromWireType (value) {
        const length = HEAPU32[value >> 2];

        let str;
        if (stdStringIsUTF8) {
          let decodeStartPtr = value + 4;
          // Looping here to support possible embedded '0' bytes
          for (var i = 0; i <= length; ++i) {
            const currentBytePtr = value + 4 + i;
            if (i == length || HEAPU8[currentBytePtr] == 0) {
              const maxRead = currentBytePtr - decodeStartPtr;
              const stringSegment = UTF8ToString(decodeStartPtr, maxRead);
              if (str === undefined) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + 1;
            }
          }
        } else {
          const a = new Array(length);
          for (var i = 0; i < length; ++i) {
            a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
          }
          str = a.join('');
        }

        _free(value);

        return str;
      },
      toWireType (destructors, value) {
        if (value instanceof ArrayBuffer) {
          value = new Uint8Array(value);
        }

        let getLength;
        const valueIsOfTypeString = (typeof value === 'string');

        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
          throwBindingError('Cannot pass non-string to std::string');
        }
        if (stdStringIsUTF8 && valueIsOfTypeString) {
          getLength = function () { return lengthBytesUTF8(value); };
        } else {
          getLength = function () { return value.length; };
        }

        // assumes 4-byte alignment
        const length = getLength();
        const ptr = _malloc(4 + length + 1);
        HEAPU32[ptr >> 2] = length;
        if (stdStringIsUTF8 && valueIsOfTypeString) {
          stringToUTF8(value, ptr + 4, length + 1);
        } else if (valueIsOfTypeString) {
          for (var i = 0; i < length; ++i) {
            const charCode = value.charCodeAt(i);
            if (charCode > 255) {
              _free(ptr);
              throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
            }
            HEAPU8[ptr + 4 + i] = charCode;
          }
        } else {
          for (var i = 0; i < length; ++i) {
            HEAPU8[ptr + 4 + i] = value[i];
          }
        }

        if (destructors !== null) {
          destructors.push(_free, ptr);
        }
        return ptr;
      },
      argPackAdvance: 8,
      readValueFromPointer: simpleReadValueFromPointer,
      destructorFunction (ptr) { _free(ptr); },
    });
  }

  function __embind_register_std_wstring (rawType, charSize, name) {
    name = readLatin1String(name);
    let decodeString; let encodeString; let getHeap; let lengthBytesUTF; let shift;
    if (charSize === 2) {
      decodeString = UTF16ToString;
      encodeString = stringToUTF16;
      lengthBytesUTF = lengthBytesUTF16;
      getHeap = function () { return HEAPU16; };
      shift = 1;
    } else if (charSize === 4) {
      decodeString = UTF32ToString;
      encodeString = stringToUTF32;
      lengthBytesUTF = lengthBytesUTF32;
      getHeap = function () { return HEAPU32; };
      shift = 2;
    }
    registerType(rawType, {
      name,
      fromWireType (value) {
        // Code mostly taken from _embind_register_std_string fromWireType
        const length = HEAPU32[value >> 2];
        const HEAP = getHeap();
        let str;

        let decodeStartPtr = value + 4;
        // Looping here to support possible embedded '0' bytes
        for (let i = 0; i <= length; ++i) {
          const currentBytePtr = value + 4 + i * charSize;
          if (i == length || HEAP[currentBytePtr >> shift] == 0) {
            const maxReadBytes = currentBytePtr - decodeStartPtr;
            const stringSegment = decodeString(decodeStartPtr, maxReadBytes);
            if (str === undefined) {
              str = stringSegment;
            } else {
              str += String.fromCharCode(0);
              str += stringSegment;
            }
            decodeStartPtr = currentBytePtr + charSize;
          }
        }

        _free(value);

        return str;
      },
      toWireType (destructors, value) {
        if (!(typeof value === 'string')) {
          throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
        }

        // assumes 4-byte alignment
        const length = lengthBytesUTF(value);
        const ptr = _malloc(4 + length + charSize);
        HEAPU32[ptr >> 2] = length >> shift;

        encodeString(value, ptr + 4, length + charSize);

        if (destructors !== null) {
          destructors.push(_free, ptr);
        }
        return ptr;
      },
      argPackAdvance: 8,
      readValueFromPointer: simpleReadValueFromPointer,
      destructorFunction (ptr) { _free(ptr); },
    });
  }

  function __embind_register_void (rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
      isVoid: true, // void return values can be optimized out sometimes
      name,
      argPackAdvance: 0,
      fromWireType () {
        return undefined;
      },
      toWireType (destructors, o) {
        // TODO: assert if anything else is given?
        return undefined;
      },
    });
  }

  function _abort () {
    abort();
  }

  function _emscripten_memcpy_big (dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num);
  }

  function abortOnCannotGrowMemory (requestedSize) {
    abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with  -s INITIAL_MEMORY=X  with X higher than the current value ${HEAP8.length}, (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 `);
  }
  function _emscripten_resize_heap (requestedSize) {
    const oldSize = HEAPU8.length;
    requestedSize >>>= 0;
    abortOnCannotGrowMemory(requestedSize);
  }
  embind_init_charCodes();
  BindingError = Module.BindingError = extendError(Error, 'BindingError');
  InternalError = Module.InternalError = extendError(Error, 'InternalError');
  init_ClassHandle();
  init_RegisteredPointer();
  init_embind();
  UnboundTypeError = Module.UnboundTypeError = extendError(Error, 'UnboundTypeError');
  init_emval();
  const ASSERTIONS = true;

  /** @type {function(string, boolean=, number=)} */
  function intArrayFromString (stringy, dontAddNull, length) {
    const len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    const u8array = new Array(len);
    const numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }

  function intArrayToString (array) {
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      let chr = array[i];
      if (chr > 0xFF) {
        if (ASSERTIONS) {
          assert(false, `Character code ${chr} (${String.fromCharCode(chr)})  at offset ${i} not in 0x00-0xFF.`);
        }
        chr &= 0xFF;
      }
      ret.push(String.fromCharCode(chr));
    }
    return ret.join('');
  }

  var asmLibraryArg = {
    _embind_register_bigint: __embind_register_bigint,
    _embind_register_bool: __embind_register_bool,
    _embind_register_class: __embind_register_class,
    _embind_register_class_constructor: __embind_register_class_constructor,
    _embind_register_class_function: __embind_register_class_function,
    _embind_register_emval: __embind_register_emval,
    _embind_register_float: __embind_register_float,
    _embind_register_integer: __embind_register_integer,
    _embind_register_memory_view: __embind_register_memory_view,
    _embind_register_std_string: __embind_register_std_string,
    _embind_register_std_wstring: __embind_register_std_wstring,
    _embind_register_void: __embind_register_void,
    abort: _abort,
    emscripten_memcpy_big: _emscripten_memcpy_big,
    emscripten_resize_heap: _emscripten_resize_heap,
  };
  const asm = createWasm();
  /** @type {function(...*):?} */
  const ___wasm_call_ctors = Module.___wasm_call_ctors = createExportWrapper('__wasm_call_ctors');

  /** @type {function(...*):?} */
  var ___getTypeName = Module.___getTypeName = createExportWrapper('__getTypeName');

  /** @type {function(...*):?} */
  const ___embind_register_native_and_builtin_types = Module.___embind_register_native_and_builtin_types = createExportWrapper('__embind_register_native_and_builtin_types');

  /** @type {function(...*):?} */
  const ___errno_location = Module.___errno_location = createExportWrapper('__errno_location');

  /** @type {function(...*):?} */
  const _fflush = Module._fflush = createExportWrapper('fflush');

  /** @type {function(...*):?} */
  var _malloc = Module._malloc = createExportWrapper('malloc');

  /** @type {function(...*):?} */
  var stackSave = Module.stackSave = createExportWrapper('stackSave');

  /** @type {function(...*):?} */
  var stackRestore = Module.stackRestore = createExportWrapper('stackRestore');

  /** @type {function(...*):?} */
  var stackAlloc = Module.stackAlloc = createExportWrapper('stackAlloc');

  /** @type {function(...*):?} */
  var _emscripten_stack_init = Module._emscripten_stack_init = function () {
    return (_emscripten_stack_init = Module._emscripten_stack_init = Module.asm.emscripten_stack_init).apply(null, arguments);
  };

  /** @type {function(...*):?} */
  var _emscripten_stack_get_free = Module._emscripten_stack_get_free = function () {
    return (_emscripten_stack_get_free = Module._emscripten_stack_get_free = Module.asm.emscripten_stack_get_free).apply(null, arguments);
  };

  /** @type {function(...*):?} */
  var _emscripten_stack_get_end = Module._emscripten_stack_get_end = function () {
    return (_emscripten_stack_get_end = Module._emscripten_stack_get_end = Module.asm.emscripten_stack_get_end).apply(null, arguments);
  };

  /** @type {function(...*):?} */
  var _free = Module._free = createExportWrapper('free');

  // === Auto-generated postamble setup entry stuff ===

  if (!Object.getOwnPropertyDescriptor(Module, 'intArrayFromString')) Module.intArrayFromString = function () { abort('\'intArrayFromString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'intArrayToString')) Module.intArrayToString = function () { abort('\'intArrayToString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ccall')) Module.ccall = function () { abort('\'ccall\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'cwrap')) Module.cwrap = function () { abort('\'cwrap\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setValue')) Module.setValue = function () { abort('\'setValue\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getValue')) Module.getValue = function () { abort('\'getValue\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'allocate')) Module.allocate = function () { abort('\'allocate\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'UTF8ArrayToString')) Module.UTF8ArrayToString = function () { abort('\'UTF8ArrayToString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'UTF8ToString')) Module.UTF8ToString = function () { abort('\'UTF8ToString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stringToUTF8Array')) Module.stringToUTF8Array = function () { abort('\'stringToUTF8Array\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stringToUTF8')) Module.stringToUTF8 = function () { abort('\'stringToUTF8\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'lengthBytesUTF8')) Module.lengthBytesUTF8 = function () { abort('\'lengthBytesUTF8\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stackTrace')) Module.stackTrace = function () { abort('\'stackTrace\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'addOnPreRun')) Module.addOnPreRun = function () { abort('\'addOnPreRun\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'addOnInit')) Module.addOnInit = function () { abort('\'addOnInit\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'addOnPreMain')) Module.addOnPreMain = function () { abort('\'addOnPreMain\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'addOnExit')) Module.addOnExit = function () { abort('\'addOnExit\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'addOnPostRun')) Module.addOnPostRun = function () { abort('\'addOnPostRun\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeStringToMemory')) Module.writeStringToMemory = function () { abort('\'writeStringToMemory\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeArrayToMemory')) Module.writeArrayToMemory = function () { abort('\'writeArrayToMemory\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeAsciiToMemory')) Module.writeAsciiToMemory = function () { abort('\'writeAsciiToMemory\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'addRunDependency')) Module.addRunDependency = function () { abort('\'addRunDependency\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'removeRunDependency')) Module.removeRunDependency = function () { abort('\'removeRunDependency\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_createFolder')) Module.FS_createFolder = function () { abort('\'FS_createFolder\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_createPath')) Module.FS_createPath = function () { abort('\'FS_createPath\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_createDataFile')) Module.FS_createDataFile = function () { abort('\'FS_createDataFile\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_createPreloadedFile')) Module.FS_createPreloadedFile = function () { abort('\'FS_createPreloadedFile\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_createLazyFile')) Module.FS_createLazyFile = function () { abort('\'FS_createLazyFile\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_createLink')) Module.FS_createLink = function () { abort('\'FS_createLink\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_createDevice')) Module.FS_createDevice = function () { abort('\'FS_createDevice\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS_unlink')) Module.FS_unlink = function () { abort('\'FS_unlink\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getLEB')) Module.getLEB = function () { abort('\'getLEB\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getFunctionTables')) Module.getFunctionTables = function () { abort('\'getFunctionTables\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'alignFunctionTables')) Module.alignFunctionTables = function () { abort('\'alignFunctionTables\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerFunctions')) Module.registerFunctions = function () { abort('\'registerFunctions\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'addFunction')) Module.addFunction = function () { abort('\'addFunction\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'removeFunction')) Module.removeFunction = function () { abort('\'removeFunction\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getFuncWrapper')) Module.getFuncWrapper = function () { abort('\'getFuncWrapper\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'prettyPrint')) Module.prettyPrint = function () { abort('\'prettyPrint\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'dynCall')) Module.dynCall = function () { abort('\'dynCall\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getCompilerSetting')) Module.getCompilerSetting = function () { abort('\'getCompilerSetting\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'print')) Module.print = function () { abort('\'print\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'printErr')) Module.printErr = function () { abort('\'printErr\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getTempRet0')) Module.getTempRet0 = function () { abort('\'getTempRet0\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setTempRet0')) Module.setTempRet0 = function () { abort('\'setTempRet0\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'callMain')) Module.callMain = function () { abort('\'callMain\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'abort')) Module.abort = function () { abort('\'abort\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'keepRuntimeAlive')) Module.keepRuntimeAlive = function () { abort('\'keepRuntimeAlive\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'zeroMemory')) Module.zeroMemory = function () { abort('\'zeroMemory\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stringToNewUTF8')) Module.stringToNewUTF8 = function () { abort('\'stringToNewUTF8\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setFileTime')) Module.setFileTime = function () { abort('\'setFileTime\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'abortOnCannotGrowMemory')) Module.abortOnCannotGrowMemory = function () { abort('\'abortOnCannotGrowMemory\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emscripten_realloc_buffer')) Module.emscripten_realloc_buffer = function () { abort('\'emscripten_realloc_buffer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ENV')) Module.ENV = function () { abort('\'ENV\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ERRNO_CODES')) Module.ERRNO_CODES = function () { abort('\'ERRNO_CODES\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ERRNO_MESSAGES')) Module.ERRNO_MESSAGES = function () { abort('\'ERRNO_MESSAGES\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setErrNo')) Module.setErrNo = function () { abort('\'setErrNo\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'inetPton4')) Module.inetPton4 = function () { abort('\'inetPton4\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'inetNtop4')) Module.inetNtop4 = function () { abort('\'inetNtop4\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'inetPton6')) Module.inetPton6 = function () { abort('\'inetPton6\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'inetNtop6')) Module.inetNtop6 = function () { abort('\'inetNtop6\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'readSockaddr')) Module.readSockaddr = function () { abort('\'readSockaddr\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeSockaddr')) Module.writeSockaddr = function () { abort('\'writeSockaddr\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'DNS')) Module.DNS = function () { abort('\'DNS\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getHostByName')) Module.getHostByName = function () { abort('\'getHostByName\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'GAI_ERRNO_MESSAGES')) Module.GAI_ERRNO_MESSAGES = function () { abort('\'GAI_ERRNO_MESSAGES\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'Protocols')) Module.Protocols = function () { abort('\'Protocols\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'Sockets')) Module.Sockets = function () { abort('\'Sockets\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getRandomDevice')) Module.getRandomDevice = function () { abort('\'getRandomDevice\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'traverseStack')) Module.traverseStack = function () { abort('\'traverseStack\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'UNWIND_CACHE')) Module.UNWIND_CACHE = function () { abort('\'UNWIND_CACHE\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'withBuiltinMalloc')) Module.withBuiltinMalloc = function () { abort('\'withBuiltinMalloc\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'readAsmConstArgsArray')) Module.readAsmConstArgsArray = function () { abort('\'readAsmConstArgsArray\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'readAsmConstArgs')) Module.readAsmConstArgs = function () { abort('\'readAsmConstArgs\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'mainThreadEM_ASM')) Module.mainThreadEM_ASM = function () { abort('\'mainThreadEM_ASM\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'jstoi_q')) Module.jstoi_q = function () { abort('\'jstoi_q\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'jstoi_s')) Module.jstoi_s = function () { abort('\'jstoi_s\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getExecutableName')) Module.getExecutableName = function () { abort('\'getExecutableName\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'listenOnce')) Module.listenOnce = function () { abort('\'listenOnce\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'autoResumeAudioContext')) Module.autoResumeAudioContext = function () { abort('\'autoResumeAudioContext\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'dynCallLegacy')) Module.dynCallLegacy = function () { abort('\'dynCallLegacy\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getDynCaller')) Module.getDynCaller = function () { abort('\'getDynCaller\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'dynCall')) Module.dynCall = function () { abort('\'dynCall\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'callRuntimeCallbacks')) Module.callRuntimeCallbacks = function () { abort('\'callRuntimeCallbacks\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'runtimeKeepalivePush')) Module.runtimeKeepalivePush = function () { abort('\'runtimeKeepalivePush\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'runtimeKeepalivePop')) Module.runtimeKeepalivePop = function () { abort('\'runtimeKeepalivePop\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'callUserCallback')) Module.callUserCallback = function () { abort('\'callUserCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'maybeExit')) Module.maybeExit = function () { abort('\'maybeExit\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'safeSetTimeout')) Module.safeSetTimeout = function () { abort('\'safeSetTimeout\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'asmjsMangle')) Module.asmjsMangle = function () { abort('\'asmjsMangle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'asyncLoad')) Module.asyncLoad = function () { abort('\'asyncLoad\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'alignMemory')) Module.alignMemory = function () { abort('\'alignMemory\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'mmapAlloc')) Module.mmapAlloc = function () { abort('\'mmapAlloc\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'reallyNegative')) Module.reallyNegative = function () { abort('\'reallyNegative\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'unSign')) Module.unSign = function () { abort('\'unSign\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'reSign')) Module.reSign = function () { abort('\'reSign\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'formatString')) Module.formatString = function () { abort('\'formatString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'PATH')) Module.PATH = function () { abort('\'PATH\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'PATH_FS')) Module.PATH_FS = function () { abort('\'PATH_FS\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'SYSCALLS')) Module.SYSCALLS = function () { abort('\'SYSCALLS\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'syscallMmap2')) Module.syscallMmap2 = function () { abort('\'syscallMmap2\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'syscallMunmap')) Module.syscallMunmap = function () { abort('\'syscallMunmap\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getSocketFromFD')) Module.getSocketFromFD = function () { abort('\'getSocketFromFD\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getSocketAddress')) Module.getSocketAddress = function () { abort('\'getSocketAddress\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'JSEvents')) Module.JSEvents = function () { abort('\'JSEvents\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerKeyEventCallback')) Module.registerKeyEventCallback = function () { abort('\'registerKeyEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'specialHTMLTargets')) Module.specialHTMLTargets = function () { abort('\'specialHTMLTargets\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'maybeCStringToJsString')) Module.maybeCStringToJsString = function () { abort('\'maybeCStringToJsString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'findEventTarget')) Module.findEventTarget = function () { abort('\'findEventTarget\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'findCanvasEventTarget')) Module.findCanvasEventTarget = function () { abort('\'findCanvasEventTarget\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getBoundingClientRect')) Module.getBoundingClientRect = function () { abort('\'getBoundingClientRect\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillMouseEventData')) Module.fillMouseEventData = function () { abort('\'fillMouseEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerMouseEventCallback')) Module.registerMouseEventCallback = function () { abort('\'registerMouseEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerWheelEventCallback')) Module.registerWheelEventCallback = function () { abort('\'registerWheelEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerUiEventCallback')) Module.registerUiEventCallback = function () { abort('\'registerUiEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerFocusEventCallback')) Module.registerFocusEventCallback = function () { abort('\'registerFocusEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillDeviceOrientationEventData')) Module.fillDeviceOrientationEventData = function () { abort('\'fillDeviceOrientationEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerDeviceOrientationEventCallback')) Module.registerDeviceOrientationEventCallback = function () { abort('\'registerDeviceOrientationEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillDeviceMotionEventData')) Module.fillDeviceMotionEventData = function () { abort('\'fillDeviceMotionEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerDeviceMotionEventCallback')) Module.registerDeviceMotionEventCallback = function () { abort('\'registerDeviceMotionEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'screenOrientation')) Module.screenOrientation = function () { abort('\'screenOrientation\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillOrientationChangeEventData')) Module.fillOrientationChangeEventData = function () { abort('\'fillOrientationChangeEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerOrientationChangeEventCallback')) Module.registerOrientationChangeEventCallback = function () { abort('\'registerOrientationChangeEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillFullscreenChangeEventData')) Module.fillFullscreenChangeEventData = function () { abort('\'fillFullscreenChangeEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerFullscreenChangeEventCallback')) Module.registerFullscreenChangeEventCallback = function () { abort('\'registerFullscreenChangeEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerRestoreOldStyle')) Module.registerRestoreOldStyle = function () { abort('\'registerRestoreOldStyle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'hideEverythingExceptGivenElement')) Module.hideEverythingExceptGivenElement = function () { abort('\'hideEverythingExceptGivenElement\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'restoreHiddenElements')) Module.restoreHiddenElements = function () { abort('\'restoreHiddenElements\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setLetterbox')) Module.setLetterbox = function () { abort('\'setLetterbox\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'currentFullscreenStrategy')) Module.currentFullscreenStrategy = function () { abort('\'currentFullscreenStrategy\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'restoreOldWindowedStyle')) Module.restoreOldWindowedStyle = function () { abort('\'restoreOldWindowedStyle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'softFullscreenResizeWebGLRenderTarget')) Module.softFullscreenResizeWebGLRenderTarget = function () { abort('\'softFullscreenResizeWebGLRenderTarget\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'doRequestFullscreen')) Module.doRequestFullscreen = function () { abort('\'doRequestFullscreen\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillPointerlockChangeEventData')) Module.fillPointerlockChangeEventData = function () { abort('\'fillPointerlockChangeEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerPointerlockChangeEventCallback')) Module.registerPointerlockChangeEventCallback = function () { abort('\'registerPointerlockChangeEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerPointerlockErrorEventCallback')) Module.registerPointerlockErrorEventCallback = function () { abort('\'registerPointerlockErrorEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'requestPointerLock')) Module.requestPointerLock = function () { abort('\'requestPointerLock\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillVisibilityChangeEventData')) Module.fillVisibilityChangeEventData = function () { abort('\'fillVisibilityChangeEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerVisibilityChangeEventCallback')) Module.registerVisibilityChangeEventCallback = function () { abort('\'registerVisibilityChangeEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerTouchEventCallback')) Module.registerTouchEventCallback = function () { abort('\'registerTouchEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillGamepadEventData')) Module.fillGamepadEventData = function () { abort('\'fillGamepadEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerGamepadEventCallback')) Module.registerGamepadEventCallback = function () { abort('\'registerGamepadEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerBeforeUnloadEventCallback')) Module.registerBeforeUnloadEventCallback = function () { abort('\'registerBeforeUnloadEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'fillBatteryEventData')) Module.fillBatteryEventData = function () { abort('\'fillBatteryEventData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'battery')) Module.battery = function () { abort('\'battery\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerBatteryEventCallback')) Module.registerBatteryEventCallback = function () { abort('\'registerBatteryEventCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setCanvasElementSize')) Module.setCanvasElementSize = function () { abort('\'setCanvasElementSize\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getCanvasElementSize')) Module.getCanvasElementSize = function () { abort('\'getCanvasElementSize\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'polyfillSetImmediate')) Module.polyfillSetImmediate = function () { abort('\'polyfillSetImmediate\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'demangle')) Module.demangle = function () { abort('\'demangle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'demangleAll')) Module.demangleAll = function () { abort('\'demangleAll\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'jsStackTrace')) Module.jsStackTrace = function () { abort('\'jsStackTrace\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stackTrace')) Module.stackTrace = function () { abort('\'stackTrace\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getEnvStrings')) Module.getEnvStrings = function () { abort('\'getEnvStrings\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'checkWasiClock')) Module.checkWasiClock = function () { abort('\'checkWasiClock\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'flush_NO_FILESYSTEM')) Module.flush_NO_FILESYSTEM = function () { abort('\'flush_NO_FILESYSTEM\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeI53ToI64')) Module.writeI53ToI64 = function () { abort('\'writeI53ToI64\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeI53ToI64Clamped')) Module.writeI53ToI64Clamped = function () { abort('\'writeI53ToI64Clamped\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeI53ToI64Signaling')) Module.writeI53ToI64Signaling = function () { abort('\'writeI53ToI64Signaling\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeI53ToU64Clamped')) Module.writeI53ToU64Clamped = function () { abort('\'writeI53ToU64Clamped\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeI53ToU64Signaling')) Module.writeI53ToU64Signaling = function () { abort('\'writeI53ToU64Signaling\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'readI53FromI64')) Module.readI53FromI64 = function () { abort('\'readI53FromI64\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'readI53FromU64')) Module.readI53FromU64 = function () { abort('\'readI53FromU64\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'convertI32PairToI53')) Module.convertI32PairToI53 = function () { abort('\'convertI32PairToI53\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'convertU32PairToI53')) Module.convertU32PairToI53 = function () { abort('\'convertU32PairToI53\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'uncaughtExceptionCount')) Module.uncaughtExceptionCount = function () { abort('\'uncaughtExceptionCount\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'exceptionLast')) Module.exceptionLast = function () { abort('\'exceptionLast\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'exceptionCaught')) Module.exceptionCaught = function () { abort('\'exceptionCaught\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ExceptionInfo')) Module.ExceptionInfo = function () { abort('\'ExceptionInfo\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'CatchInfo')) Module.CatchInfo = function () { abort('\'CatchInfo\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'exception_addRef')) Module.exception_addRef = function () { abort('\'exception_addRef\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'exception_decRef')) Module.exception_decRef = function () { abort('\'exception_decRef\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'Browser')) Module.Browser = function () { abort('\'Browser\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'funcWrappers')) Module.funcWrappers = function () { abort('\'funcWrappers\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getFuncWrapper')) Module.getFuncWrapper = function () { abort('\'getFuncWrapper\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setMainLoop')) Module.setMainLoop = function () { abort('\'setMainLoop\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'wget')) Module.wget = function () { abort('\'wget\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'FS')) Module.FS = function () { abort('\'FS\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'MEMFS')) Module.MEMFS = function () { abort('\'MEMFS\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'TTY')) Module.TTY = function () { abort('\'TTY\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'PIPEFS')) Module.PIPEFS = function () { abort('\'PIPEFS\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'SOCKFS')) Module.SOCKFS = function () { abort('\'SOCKFS\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, '_setNetworkCallback')) Module._setNetworkCallback = function () { abort('\'_setNetworkCallback\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'tempFixedLengthArray')) Module.tempFixedLengthArray = function () { abort('\'tempFixedLengthArray\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'miniTempWebGLFloatBuffers')) Module.miniTempWebGLFloatBuffers = function () { abort('\'miniTempWebGLFloatBuffers\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'heapObjectForWebGLType')) Module.heapObjectForWebGLType = function () { abort('\'heapObjectForWebGLType\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'heapAccessShiftForWebGLHeap')) Module.heapAccessShiftForWebGLHeap = function () { abort('\'heapAccessShiftForWebGLHeap\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'GL')) Module.GL = function () { abort('\'GL\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emscriptenWebGLGet')) Module.emscriptenWebGLGet = function () { abort('\'emscriptenWebGLGet\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'computeUnpackAlignedImageSize')) Module.computeUnpackAlignedImageSize = function () { abort('\'computeUnpackAlignedImageSize\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emscriptenWebGLGetTexPixelData')) Module.emscriptenWebGLGetTexPixelData = function () { abort('\'emscriptenWebGLGetTexPixelData\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emscriptenWebGLGetUniform')) Module.emscriptenWebGLGetUniform = function () { abort('\'emscriptenWebGLGetUniform\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'webglGetUniformLocation')) Module.webglGetUniformLocation = function () { abort('\'webglGetUniformLocation\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'webglPrepareUniformLocationsBeforeFirstUse')) Module.webglPrepareUniformLocationsBeforeFirstUse = function () { abort('\'webglPrepareUniformLocationsBeforeFirstUse\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'webglGetLeftBracePos')) Module.webglGetLeftBracePos = function () { abort('\'webglGetLeftBracePos\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emscriptenWebGLGetVertexAttrib')) Module.emscriptenWebGLGetVertexAttrib = function () { abort('\'emscriptenWebGLGetVertexAttrib\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'writeGLArray')) Module.writeGLArray = function () { abort('\'writeGLArray\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'AL')) Module.AL = function () { abort('\'AL\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'SDL_unicode')) Module.SDL_unicode = function () { abort('\'SDL_unicode\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'SDL_ttfContext')) Module.SDL_ttfContext = function () { abort('\'SDL_ttfContext\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'SDL_audio')) Module.SDL_audio = function () { abort('\'SDL_audio\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'SDL')) Module.SDL = function () { abort('\'SDL\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'SDL_gfx')) Module.SDL_gfx = function () { abort('\'SDL_gfx\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'GLUT')) Module.GLUT = function () { abort('\'GLUT\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'EGL')) Module.EGL = function () { abort('\'EGL\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'GLFW_Window')) Module.GLFW_Window = function () { abort('\'GLFW_Window\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'GLFW')) Module.GLFW = function () { abort('\'GLFW\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'GLEW')) Module.GLEW = function () { abort('\'GLEW\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'IDBStore')) Module.IDBStore = function () { abort('\'IDBStore\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'runAndAbortIfError')) Module.runAndAbortIfError = function () { abort('\'runAndAbortIfError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emval_handle_array')) Module.emval_handle_array = function () { abort('\'emval_handle_array\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emval_free_list')) Module.emval_free_list = function () { abort('\'emval_free_list\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emval_symbols')) Module.emval_symbols = function () { abort('\'emval_symbols\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'init_emval')) Module.init_emval = function () { abort('\'init_emval\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'count_emval_handles')) Module.count_emval_handles = function () { abort('\'count_emval_handles\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'get_first_emval')) Module.get_first_emval = function () { abort('\'get_first_emval\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getStringOrSymbol')) Module.getStringOrSymbol = function () { abort('\'getStringOrSymbol\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'requireHandle')) Module.requireHandle = function () { abort('\'requireHandle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emval_newers')) Module.emval_newers = function () { abort('\'emval_newers\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'craftEmvalAllocator')) Module.craftEmvalAllocator = function () { abort('\'craftEmvalAllocator\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emval_get_global')) Module.emval_get_global = function () { abort('\'emval_get_global\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'emval_methodCallers')) Module.emval_methodCallers = function () { abort('\'emval_methodCallers\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'InternalError')) Module.InternalError = function () { abort('\'InternalError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'BindingError')) Module.BindingError = function () { abort('\'BindingError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'UnboundTypeError')) Module.UnboundTypeError = function () { abort('\'UnboundTypeError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'PureVirtualError')) Module.PureVirtualError = function () { abort('\'PureVirtualError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'init_embind')) Module.init_embind = function () { abort('\'init_embind\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'throwInternalError')) Module.throwInternalError = function () { abort('\'throwInternalError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'throwBindingError')) Module.throwBindingError = function () { abort('\'throwBindingError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'throwUnboundTypeError')) Module.throwUnboundTypeError = function () { abort('\'throwUnboundTypeError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ensureOverloadTable')) Module.ensureOverloadTable = function () { abort('\'ensureOverloadTable\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'exposePublicSymbol')) Module.exposePublicSymbol = function () { abort('\'exposePublicSymbol\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'replacePublicSymbol')) Module.replacePublicSymbol = function () { abort('\'replacePublicSymbol\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'extendError')) Module.extendError = function () { abort('\'extendError\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'createNamedFunction')) Module.createNamedFunction = function () { abort('\'createNamedFunction\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registeredInstances')) Module.registeredInstances = function () { abort('\'registeredInstances\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getBasestPointer')) Module.getBasestPointer = function () { abort('\'getBasestPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerInheritedInstance')) Module.registerInheritedInstance = function () { abort('\'registerInheritedInstance\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'unregisterInheritedInstance')) Module.unregisterInheritedInstance = function () { abort('\'unregisterInheritedInstance\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getInheritedInstance')) Module.getInheritedInstance = function () { abort('\'getInheritedInstance\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getInheritedInstanceCount')) Module.getInheritedInstanceCount = function () { abort('\'getInheritedInstanceCount\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getLiveInheritedInstances')) Module.getLiveInheritedInstances = function () { abort('\'getLiveInheritedInstances\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registeredTypes')) Module.registeredTypes = function () { abort('\'registeredTypes\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'awaitingDependencies')) Module.awaitingDependencies = function () { abort('\'awaitingDependencies\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'typeDependencies')) Module.typeDependencies = function () { abort('\'typeDependencies\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registeredPointers')) Module.registeredPointers = function () { abort('\'registeredPointers\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'registerType')) Module.registerType = function () { abort('\'registerType\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'whenDependentTypesAreResolved')) Module.whenDependentTypesAreResolved = function () { abort('\'whenDependentTypesAreResolved\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'embind_charCodes')) Module.embind_charCodes = function () { abort('\'embind_charCodes\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'embind_init_charCodes')) Module.embind_init_charCodes = function () { abort('\'embind_init_charCodes\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'readLatin1String')) Module.readLatin1String = function () { abort('\'readLatin1String\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getTypeName')) Module.getTypeName = function () { abort('\'getTypeName\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'heap32VectorToArray')) Module.heap32VectorToArray = function () { abort('\'heap32VectorToArray\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'requireRegisteredType')) Module.requireRegisteredType = function () { abort('\'requireRegisteredType\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'getShiftFromSize')) Module.getShiftFromSize = function () { abort('\'getShiftFromSize\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'integerReadValueFromPointer')) Module.integerReadValueFromPointer = function () { abort('\'integerReadValueFromPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'enumReadValueFromPointer')) Module.enumReadValueFromPointer = function () { abort('\'enumReadValueFromPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'floatReadValueFromPointer')) Module.floatReadValueFromPointer = function () { abort('\'floatReadValueFromPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'simpleReadValueFromPointer')) Module.simpleReadValueFromPointer = function () { abort('\'simpleReadValueFromPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'runDestructors')) Module.runDestructors = function () { abort('\'runDestructors\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'new_')) Module.new_ = function () { abort('\'new_\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'craftInvokerFunction')) Module.craftInvokerFunction = function () { abort('\'craftInvokerFunction\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'embind__requireFunction')) Module.embind__requireFunction = function () { abort('\'embind__requireFunction\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'tupleRegistrations')) Module.tupleRegistrations = function () { abort('\'tupleRegistrations\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'structRegistrations')) Module.structRegistrations = function () { abort('\'structRegistrations\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'genericPointerToWireType')) Module.genericPointerToWireType = function () { abort('\'genericPointerToWireType\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'constNoSmartPtrRawPointerToWireType')) Module.constNoSmartPtrRawPointerToWireType = function () { abort('\'constNoSmartPtrRawPointerToWireType\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'nonConstNoSmartPtrRawPointerToWireType')) Module.nonConstNoSmartPtrRawPointerToWireType = function () { abort('\'nonConstNoSmartPtrRawPointerToWireType\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'init_RegisteredPointer')) Module.init_RegisteredPointer = function () { abort('\'init_RegisteredPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'RegisteredPointer')) Module.RegisteredPointer = function () { abort('\'RegisteredPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'RegisteredPointer_getPointee')) Module.RegisteredPointer_getPointee = function () { abort('\'RegisteredPointer_getPointee\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'RegisteredPointer_destructor')) Module.RegisteredPointer_destructor = function () { abort('\'RegisteredPointer_destructor\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'RegisteredPointer_deleteObject')) Module.RegisteredPointer_deleteObject = function () { abort('\'RegisteredPointer_deleteObject\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'RegisteredPointer_fromWireType')) Module.RegisteredPointer_fromWireType = function () { abort('\'RegisteredPointer_fromWireType\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'runDestructor')) Module.runDestructor = function () { abort('\'runDestructor\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'releaseClassHandle')) Module.releaseClassHandle = function () { abort('\'releaseClassHandle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'finalizationGroup')) Module.finalizationGroup = function () { abort('\'finalizationGroup\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'detachFinalizer_deps')) Module.detachFinalizer_deps = function () { abort('\'detachFinalizer_deps\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'detachFinalizer')) Module.detachFinalizer = function () { abort('\'detachFinalizer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'attachFinalizer')) Module.attachFinalizer = function () { abort('\'attachFinalizer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'makeClassHandle')) Module.makeClassHandle = function () { abort('\'makeClassHandle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'init_ClassHandle')) Module.init_ClassHandle = function () { abort('\'init_ClassHandle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ClassHandle')) Module.ClassHandle = function () { abort('\'ClassHandle\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ClassHandle_isAliasOf')) Module.ClassHandle_isAliasOf = function () { abort('\'ClassHandle_isAliasOf\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'throwInstanceAlreadyDeleted')) Module.throwInstanceAlreadyDeleted = function () { abort('\'throwInstanceAlreadyDeleted\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ClassHandle_clone')) Module.ClassHandle_clone = function () { abort('\'ClassHandle_clone\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ClassHandle_delete')) Module.ClassHandle_delete = function () { abort('\'ClassHandle_delete\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'deletionQueue')) Module.deletionQueue = function () { abort('\'deletionQueue\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ClassHandle_isDeleted')) Module.ClassHandle_isDeleted = function () { abort('\'ClassHandle_isDeleted\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'ClassHandle_deleteLater')) Module.ClassHandle_deleteLater = function () { abort('\'ClassHandle_deleteLater\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'flushPendingDeletes')) Module.flushPendingDeletes = function () { abort('\'flushPendingDeletes\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'delayFunction')) Module.delayFunction = function () { abort('\'delayFunction\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'setDelayFunction')) Module.setDelayFunction = function () { abort('\'setDelayFunction\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'RegisteredClass')) Module.RegisteredClass = function () { abort('\'RegisteredClass\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'shallowCopyInternalPointer')) Module.shallowCopyInternalPointer = function () { abort('\'shallowCopyInternalPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'downcastPointer')) Module.downcastPointer = function () { abort('\'downcastPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'upcastPointer')) Module.upcastPointer = function () { abort('\'upcastPointer\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'validateThis')) Module.validateThis = function () { abort('\'validateThis\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'char_0')) Module.char_0 = function () { abort('\'char_0\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'char_9')) Module.char_9 = function () { abort('\'char_9\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'makeLegalFunctionName')) Module.makeLegalFunctionName = function () { abort('\'makeLegalFunctionName\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'warnOnce')) Module.warnOnce = function () { abort('\'warnOnce\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stackSave')) Module.stackSave = function () { abort('\'stackSave\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stackRestore')) Module.stackRestore = function () { abort('\'stackRestore\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stackAlloc')) Module.stackAlloc = function () { abort('\'stackAlloc\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'AsciiToString')) Module.AsciiToString = function () { abort('\'AsciiToString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stringToAscii')) Module.stringToAscii = function () { abort('\'stringToAscii\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'UTF16ToString')) Module.UTF16ToString = function () { abort('\'UTF16ToString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stringToUTF16')) Module.stringToUTF16 = function () { abort('\'stringToUTF16\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'lengthBytesUTF16')) Module.lengthBytesUTF16 = function () { abort('\'lengthBytesUTF16\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'UTF32ToString')) Module.UTF32ToString = function () { abort('\'UTF32ToString\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'stringToUTF32')) Module.stringToUTF32 = function () { abort('\'stringToUTF32\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'lengthBytesUTF32')) Module.lengthBytesUTF32 = function () { abort('\'lengthBytesUTF32\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'allocateUTF8')) Module.allocateUTF8 = function () { abort('\'allocateUTF8\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  if (!Object.getOwnPropertyDescriptor(Module, 'allocateUTF8OnStack')) Module.allocateUTF8OnStack = function () { abort('\'allocateUTF8OnStack\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); };
  Module.writeStackCookie = writeStackCookie;
  Module.checkStackCookie = checkStackCookie;
  if (!Object.getOwnPropertyDescriptor(Module, 'ALLOC_NORMAL')) Object.defineProperty(Module, 'ALLOC_NORMAL', { configurable: true, get () { abort('\'ALLOC_NORMAL\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); } });
  if (!Object.getOwnPropertyDescriptor(Module, 'ALLOC_STACK')) Object.defineProperty(Module, 'ALLOC_STACK', { configurable: true, get () { abort('\'ALLOC_STACK\' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)'); } });

  let calledRun;

  /**
* @constructor
* @this {ExitStatus}
*/
  function ExitStatus (status) {
    this.name = 'ExitStatus';
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }

  const calledMain = false;

  dependenciesFulfilled = function runCaller () {
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
  };

  function stackCheckInit () {
    // This is normally called automatically during __wasm_call_ctors but need to
    // get these values before even running any of the ctors so we call it redundantly
    // here.
    // TODO(sbc): Move writeStackCookie to native to to avoid this.
    _emscripten_stack_init();
    writeStackCookie();
  }

  /** @type {function(Array=)} */
  function run (args) {
    args = args || arguments_;

    if (runDependencies > 0) {
      return;
    }

    stackCheckInit();

    preRun();

    // a preRun added a dependency, run will be called later
    if (runDependencies > 0) {
      return;
    }

    function doRun () {
      // run may have just been called through dependencies being fulfilled just in this very frame,
      // or while the async setStatus time below was happening
      if (calledRun) return;
      calledRun = true;
      Module.calledRun = true;

      if (ABORT) return;

      initRuntime();

      if (Module.onRuntimeInitialized) Module.onRuntimeInitialized();

      assert(!Module._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

      postRun();
    }

    if (Module.setStatus) {
      Module.setStatus('Running...');
      setTimeout(() => {
        setTimeout(() => {
          Module.setStatus('');
        }, 1);
        doRun();
      }, 1);
    } else {
      doRun();
    }
    checkStackCookie();
  }
  Module.run = run;

  function checkUnflushedContent () {
    // Compiler settings do not allow exiting the runtime, so flushing
    // the streams is not possible. but in ASSERTIONS mode we check
    // if there was something to flush, and if so tell the user they
    // should request that the runtime be exitable.
    // Normally we would not even include flush() at all, but in ASSERTIONS
    // builds we do so just for this check, and here we see if there is any
    // content to flush, that is, we check if there would have been
    // something a non-ASSERTIONS build would have not seen.
    // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
    // mode (which has its own special function for this; otherwise, all
    // the code is inside libc)
    const oldOut = out;
    const oldErr = err;
    let has = false;
    out = err = function (x) {
      has = true;
    };
    try { // it doesn't matter if it fails
      const flush = null;
      if (flush) flush();
    } catch (e) { }
    out = oldOut;
    err = oldErr;
    if (has) {
      warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
      warnOnce('(this may also be due to not including full filesystem support - try building with -s FORCE_FILESYSTEM=1)');
    }
  }

  /** @param {boolean|number=} implicit */
  function exit (status, implicit) {
    EXITSTATUS = status;

    checkUnflushedContent();

    if (keepRuntimeAlive()) {
      // if exit() was called, we may warn the user if the runtime isn't actually being shut down
      if (!implicit) {
        const msg = `program exited (with status: ${status}), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)`;
        err(msg);
      }
    } else {
      exitRuntime();
    }

    procExit(status);
  }

  function procExit (code) {
    EXITSTATUS = code;
    if (!keepRuntimeAlive()) {
      if (Module.onExit) Module.onExit(code);
      ABORT = true;
    }
    quit_(code, new ExitStatus(code));
  }

  if (Module.preInit) {
    if (typeof Module.preInit === 'function') Module.preInit = [Module.preInit];
    while (Module.preInit.length > 0) {
      Module.preInit.pop()();
    }
  }

  run();
}
