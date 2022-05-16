(function () {
  'use strict';

  function errMsg(errCode, msg) {
    return (msg || "") + " (SystemJS Error#" + errCode + " " + "https://git.io/JvFET#" + errCode + ")";
  }

  var hasSymbol = typeof Symbol !== 'undefined';
  var hasSelf = typeof self !== 'undefined';
  var hasDocument = typeof document !== 'undefined';

  var envGlobal = hasSelf ? self : global;

  var baseUrl;

  if (hasDocument) {
    var baseEl = document.querySelector('base[href]');
    if (baseEl)
      baseUrl = baseEl.href;
  }

  if (!baseUrl && typeof location !== 'undefined') {
    baseUrl = location.href.split('#')[0].split('?')[0];
    var lastSepIndex = baseUrl.lastIndexOf('/');
    if (lastSepIndex !== -1)
      baseUrl = baseUrl.slice(0, lastSepIndex + 1);
  }

  var backslashRegEx = /\\/g;
  function resolveIfNotPlainOrUrl (relUrl, parentUrl) {
    if (relUrl.indexOf('\\') !== -1)
      relUrl = relUrl.replace(backslashRegEx, '/');
    // protocol-relative
    if (relUrl[0] === '/' && relUrl[1] === '/') {
      return parentUrl.slice(0, parentUrl.indexOf(':') + 1) + relUrl;
    }
    // relative-url
    else if (relUrl[0] === '.' && (relUrl[1] === '/' || relUrl[1] === '.' && (relUrl[2] === '/' || relUrl.length === 2 && (relUrl += '/')) ||
        relUrl.length === 1  && (relUrl += '/')) ||
        relUrl[0] === '/') {
      var parentProtocol = parentUrl.slice(0, parentUrl.indexOf(':') + 1);
      // Disabled, but these cases will give inconsistent results for deep backtracking
      //if (parentUrl[parentProtocol.length] !== '/')
      //  throw Error('Cannot resolve');
      // read pathname from parent URL
      // pathname taken to be part after leading "/"
      var pathname;
      if (parentUrl[parentProtocol.length + 1] === '/') {
        // resolving to a :// so we need to read out the auth and host
        if (parentProtocol !== 'file:') {
          pathname = parentUrl.slice(parentProtocol.length + 2);
          pathname = pathname.slice(pathname.indexOf('/') + 1);
        }
        else {
          pathname = parentUrl.slice(8);
        }
      }
      else {
        // resolving to :/ so pathname is the /... part
        pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === '/'));
      }

      if (relUrl[0] === '/')
        return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl;

      // join together and split for removal of .. and . segments
      // looping the string instead of anything fancy for perf reasons
      // '../../../../../z' resolved to 'x/y' is just 'z'
      var segmented = pathname.slice(0, pathname.lastIndexOf('/') + 1) + relUrl;

      var output = [];
      var segmentIndex = -1;
      for (var i = 0; i < segmented.length; i++) {
        // busy reading a segment - only terminate on '/'
        if (segmentIndex !== -1) {
          if (segmented[i] === '/') {
            output.push(segmented.slice(segmentIndex, i + 1));
            segmentIndex = -1;
          }
        }

        // new segment - check if it is relative
        else if (segmented[i] === '.') {
          // ../ segment
          if (segmented[i + 1] === '.' && (segmented[i + 2] === '/' || i + 2 === segmented.length)) {
            output.pop();
            i += 2;
          }
          // ./ segment
          else if (segmented[i + 1] === '/' || i + 1 === segmented.length) {
            i += 1;
          }
          else {
            // the start of a new segment as below
            segmentIndex = i;
          }
        }
        // it is the start of a new segment
        else {
          segmentIndex = i;
        }
      }
      // finish reading out the last segment
      if (segmentIndex !== -1)
        output.push(segmented.slice(segmentIndex));
      return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join('');
    }
  }

  /*
   * Import maps implementation
   *
   * To make lookups fast we pre-resolve the entire import map
   * and then match based on backtracked hash lookups
   *
   */

  function resolveUrl (relUrl, parentUrl) {
    return resolveIfNotPlainOrUrl(relUrl, parentUrl) || (relUrl.indexOf(':') !== -1 ? relUrl : resolveIfNotPlainOrUrl('./' + relUrl, parentUrl));
  }

  function resolveAndComposePackages (packages, outPackages, baseUrl, parentMap, parentUrl) {
    for (var p in packages) {
      var resolvedLhs = resolveIfNotPlainOrUrl(p, baseUrl) || p;
      var rhs = packages[p];
      // package fallbacks not currently supported
      if (typeof rhs !== 'string')
        continue;
      var mapped = resolveImportMap(parentMap, resolveIfNotPlainOrUrl(rhs, baseUrl) || rhs, parentUrl);
      if (!mapped) {
        targetWarning('W1', p, rhs, 'bare specifier did not resolve');
      }
      else
        outPackages[resolvedLhs] = mapped;
    }
  }

  function resolveAndComposeImportMap (json, baseUrl, outMap) {
    if (json.imports)
      resolveAndComposePackages(json.imports, outMap.imports, baseUrl, outMap, null);

    var u;
    for (u in json.scopes || {}) {
      var resolvedScope = resolveUrl(u, baseUrl);
      resolveAndComposePackages(json.scopes[u], outMap.scopes[resolvedScope] || (outMap.scopes[resolvedScope] = {}), baseUrl, outMap, resolvedScope);
    }

    for (u in json.depcache || {})
      outMap.depcache[resolveUrl(u, baseUrl)] = json.depcache[u];
    
    for (u in json.integrity || {})
      outMap.integrity[resolveUrl(u, baseUrl)] = json.integrity[u];
  }

  function getMatch (path, matchObj) {
    if (matchObj[path])
      return path;
    var sepIndex = path.length;
    do {
      var segment = path.slice(0, sepIndex + 1);
      if (segment in matchObj)
        return segment;
    } while ((sepIndex = path.lastIndexOf('/', sepIndex - 1)) !== -1)
  }

  function applyPackages (id, packages) {
    var pkgName = getMatch(id, packages);
    if (pkgName) {
      var pkg = packages[pkgName];
      if (pkg === null) return;
      if (id.length > pkgName.length && pkg[pkg.length - 1] !== '/') {
        targetWarning('W2', pkgName, pkg, "should have a trailing '/'");
      }
      else
        return pkg + id.slice(pkgName.length);
    }
  }

  function targetWarning (code, match, target, msg) {
    console.warn(errMsg(code,  "Package target " + msg + ", resolving target '" + target + "' for " + match));
  }

  function resolveImportMap (importMap, resolvedOrPlain, parentUrl) {
    var scopes = importMap.scopes;
    var scopeUrl = parentUrl && getMatch(parentUrl, scopes);
    while (scopeUrl) {
      var packageResolution = applyPackages(resolvedOrPlain, scopes[scopeUrl]);
      if (packageResolution)
        return packageResolution;
      scopeUrl = getMatch(scopeUrl.slice(0, scopeUrl.lastIndexOf('/')), scopes);
    }
    return applyPackages(resolvedOrPlain, importMap.imports) || resolvedOrPlain.indexOf(':') !== -1 && resolvedOrPlain;
  }

  /*
   * SystemJS Core
   * 
   * Provides
   * - System.import
   * - System.register support for
   *     live bindings, function hoisting through circular references,
   *     reexports, dynamic import, import.meta.url, top-level await
   * - System.getRegister to get the registration
   * - Symbol.toStringTag support in Module objects
   * - Hookable System.createContext to customize import.meta
   * - System.onload(err, id, deps) handler for tracing / hot-reloading
   * 
   * Core comes with no System.prototype.resolve or
   * System.prototype.instantiate implementations
   */

  var toStringTag = hasSymbol && Symbol.toStringTag;
  var REGISTRY = hasSymbol ? Symbol() : '@';

  function SystemJS () {
    this[REGISTRY] = {};
  }

  var systemJSPrototype = SystemJS.prototype;

  systemJSPrototype.import = function (id, parentUrl) {
    var loader = this;
    return Promise.resolve(loader.prepareImport())
    .then(function() {
      return loader.resolve(id, parentUrl);
    })
    .then(function (id) {
      var load = getOrCreateLoad(loader, id);
      return load.C || topLevelLoad(loader, load);
    });
  };

  // Hookable createContext function -> allowing eg custom import meta
  systemJSPrototype.createContext = function (parentId) {
    var loader = this;
    return {
      url: parentId,
      resolve: function (id, parentUrl) {
        return Promise.resolve(loader.resolve(id, parentUrl || parentId));
      }
    };
  };

  // onLoad(err, id, deps) provided for tracing / hot-reloading
  systemJSPrototype.onload = function () {};
  function loadToId (load) {
    return load.id;
  }
  function triggerOnload (loader, load, err, isErrSource) {
    loader.onload(err, load.id, load.d && load.d.map(loadToId), !!isErrSource);
    if (err)
      throw err;
  }

  var lastRegister;
  systemJSPrototype.register = function (deps, declare) {
    lastRegister = [deps, declare];
  };

  /*
   * getRegister provides the last anonymous System.register call
   */
  systemJSPrototype.getRegister = function () {
    var _lastRegister = lastRegister;
    lastRegister = undefined;
    return _lastRegister;
  };

  function getOrCreateLoad (loader, id, firstParentUrl) {
    var load = loader[REGISTRY][id];
    if (load)
      return load;

    var importerSetters = [];
    var ns = Object.create(null);
    if (toStringTag)
      Object.defineProperty(ns, toStringTag, { value: 'Module' });
    
    var instantiatePromise = Promise.resolve()
    .then(function () {
      return loader.instantiate(id, firstParentUrl);
    })
    .then(function (registration) {
      if (!registration)
        throw Error(errMsg(2,  'Module ' + id + ' did not instantiate'));
      function _export (name, value) {
        // note if we have hoisted exports (including reexports)
        load.h = true;
        var changed = false;
        if (typeof name === 'string') {
          if (!(name in ns) || ns[name] !== value) {
            ns[name] = value;
            changed = true;
          }
        }
        else {
          for (var p in name) {
            var value = name[p];
            if (!(p in ns) || ns[p] !== value) {
              ns[p] = value;
              changed = true;
            }
          }

          if (name.__esModule) {
            ns.__esModule = name.__esModule;
          }
        }
        if (changed)
          for (var i = 0; i < importerSetters.length; i++) {
            var setter = importerSetters[i];
            if (setter) setter(ns);
          }
        return value;
      }
      var declared = registration[1](_export, registration[1].length === 2 ? {
        import: function (importId) {
          return loader.import(importId, id);
        },
        meta: loader.createContext(id)
      } : undefined);
      load.e = declared.execute || function () {};
      return [registration[0], declared.setters || []];
    }, function (err) {
      load.e = null;
      load.er = err;
      triggerOnload(loader, load, err, true);
      throw err;
    });

    var linkPromise = instantiatePromise
    .then(function (instantiation) {
      return Promise.all(instantiation[0].map(function (dep, i) {
        var setter = instantiation[1][i];
        return Promise.resolve(loader.resolve(dep, id))
        .then(function (depId) {
          var depLoad = getOrCreateLoad(loader, depId, id);
          // depLoad.I may be undefined for already-evaluated
          return Promise.resolve(depLoad.I)
          .then(function () {
            if (setter) {
              depLoad.i.push(setter);
              // only run early setters when there are hoisted exports of that module
              // the timing works here as pending hoisted export calls will trigger through importerSetters
              if (depLoad.h || !depLoad.I)
                setter(depLoad.n);
            }
            return depLoad;
          });
        });
      }))
      .then(function (depLoads) {
        load.d = depLoads;
      });
    });

    // Capital letter = a promise function
    return load = loader[REGISTRY][id] = {
      id: id,
      // importerSetters, the setters functions registered to this dependency
      // we retain this to add more later
      i: importerSetters,
      // module namespace object
      n: ns,

      // instantiate
      I: instantiatePromise,
      // link
      L: linkPromise,
      // whether it has hoisted exports
      h: false,

      // On instantiate completion we have populated:
      // dependency load records
      d: undefined,
      // execution function
      e: undefined,

      // On execution we have populated:
      // the execution error if any
      er: undefined,
      // in the case of TLA, the execution promise
      E: undefined,

      // On execution, L, I, E cleared

      // Promise for top-level completion
      C: undefined,

      // parent instantiator / executor
      p: undefined
    };
  }

  function instantiateAll (loader, load, parent, loaded) {
    if (!loaded[load.id]) {
      loaded[load.id] = true;
      // load.L may be undefined for already-instantiated
      return Promise.resolve(load.L)
      .then(function () {
        if (!load.p || load.p.e === null)
          load.p = parent;
        return Promise.all(load.d.map(function (dep) {
          return instantiateAll(loader, dep, parent, loaded);
        }));
      })
      .catch(function (err) {
        if (load.er)
          throw err;
        load.e = null;
        triggerOnload(loader, load, err, false);
        throw err;
      });
    }
  }

  function topLevelLoad (loader, load) {
    return load.C = instantiateAll(loader, load, load, {})
    .then(function () {
      return postOrderExec(loader, load, {});
    })
    .then(function () {
      return load.n;
    });
  }

  // the closest we can get to call(undefined)
  var nullContext = Object.freeze(Object.create(null));

  // returns a promise if and only if a top-level await subgraph
  // throws on sync errors
  function postOrderExec (loader, load, seen) {
    if (seen[load.id])
      return;
    seen[load.id] = true;

    if (!load.e) {
      if (load.er)
        throw load.er;
      if (load.E)
        return load.E;
      return;
    }

    // deps execute first, unless circular
    var depLoadPromises;
    load.d.forEach(function (depLoad) {
      try {
        var depLoadPromise = postOrderExec(loader, depLoad, seen);
        if (depLoadPromise) 
          (depLoadPromises = depLoadPromises || []).push(depLoadPromise);
      }
      catch (err) {
        load.e = null;
        load.er = err;
        triggerOnload(loader, load, err, false);
        throw err;
      }
    });
    if (depLoadPromises)
      return Promise.all(depLoadPromises).then(doExec);

    return doExec();

    function doExec () {
      try {
        var execPromise = load.e.call(nullContext);
        if (execPromise) {
          execPromise = execPromise.then(function () {
            load.C = load.n;
            load.E = null; // indicates completion
            if (!false) triggerOnload(loader, load, null, true);
          }, function (err) {
            load.er = err;
            load.E = null;
            if (!false) triggerOnload(loader, load, err, true);
            throw err;
          });
          return load.E = execPromise;
        }
        // (should be a promise, but a minify optimization to leave out Promise.resolve)
        load.C = load.n;
        load.L = load.I = undefined;
      }
      catch (err) {
        load.er = err;
        throw err;
      }
      finally {
        load.e = null;
        triggerOnload(loader, load, load.er, true);
      }
    }
  }

  envGlobal.System = new SystemJS();

  systemJSPrototype.instantiate=function(t,o){throw new Error(`Unable to instantiate ${t} from ${o}`)};

  let baseUrl$1=baseUrl;function setBaseUrl(r){baseUrl$1=r;}

  const importMap={imports:{},scopes:{}};function setImportMap(o,r){resolveAndComposeImportMap(o,r||baseUrl$1,importMap);}function throwUnresolved(o,r){throw new Error(`Unresolved id: ${o} from parentUrl: ${r}`)}systemJSPrototype.resolve=function(o,r){return resolveImportMap(importMap,resolveIfNotPlainOrUrl(o,r=r||baseUrl$1)||o,r)||throwUnresolved(o,r)};

  function warmup({pathname:t="/",importMap:e,importMapUrl:n,defaultHandler:r,handlers:o}){if(setBaseUrl(`no-schema:${t}`),setImportMap(e,`no-schema:/${n}`),r&&hookInstantiationOverSchema("no-schema:",wrapHandler(r)),o)for(const t of Object.keys(o))hookInstantiationOverSchema(t,wrapHandler(o[t]));}function isThenable(t){return Boolean(t&&"function"==typeof t.then)}function wrapHandler(t){return function(e){const n=this;let r;try{r=t(e);}catch(t){return Promise.reject(t)}return isThenable(r)?new Promise(t=>r.then(()=>{t(n.getRegister());})):n.getRegister()}}function hookInstantiationOverSchema(t,e){const n=systemJSPrototype.instantiate;systemJSPrototype.instantiate=function(r,o){const s=r.substr(0,t.length)===t?r.substr(t.length):null;return null===s?n.call(this,r,o):e.call(this,s,o)};}

  /*
   * SystemJS named register extension
   * Supports System.register('name', [..deps..], function (_export, _context) { ... })
   * 
   * Names are written to the registry as-is
   * System.register('x', ...) can be imported as System.import('x')
   */
  (function (global) {
    var System = global.System;
    setRegisterRegistry(System);
    var systemJSPrototype = System.constructor.prototype;
    var constructor = System.constructor;
    var SystemJS = function () {
      constructor.call(this);
      setRegisterRegistry(this);
    };
    SystemJS.prototype = systemJSPrototype;
    System.constructor = SystemJS;

    var firstNamedDefine;

    function setRegisterRegistry(systemInstance) {
      systemInstance.registerRegistry = Object.create(null);
    }

    var register = systemJSPrototype.register;
    systemJSPrototype.register = function (name, deps, declare) {
      if (typeof name !== 'string')
        return register.apply(this, arguments);
      var define = [deps, declare];
      this.registerRegistry[name] = define;
      if (!firstNamedDefine) {
        firstNamedDefine = define;
        Promise.resolve().then(function () {
          firstNamedDefine = null;
        });
      }
      return register.apply(this, arguments);
    };

    var resolve = systemJSPrototype.resolve;
    systemJSPrototype.resolve = function (id, parentURL) {
      try {
        // Prefer import map (or other existing) resolution over the registerRegistry
        return resolve.call(this, id, parentURL);
      } catch (err) {
        if (id in this.registerRegistry) {
          return id;
        }
        throw err;
      }
    };

    var instantiate = systemJSPrototype.instantiate;
    systemJSPrototype.instantiate = function (url, firstParentUrl) {
      var result = this.registerRegistry[url];
      if (result) {
        this.registerRegistry[url] = null;
        return result;
      } else {
        return instantiate.call(this, url, firstParentUrl);
      }
    };

    var getRegister = systemJSPrototype.getRegister;
    systemJSPrototype.getRegister = function () {
      // Calling getRegister() because other extras need to know it was called so they can perform side effects
      var register = getRegister.call(this);

      var result = firstNamedDefine || register;
      firstNamedDefine = null;
      return result;
    };
  })(typeof self !== 'undefined' ? self : global);

  systemJSPrototype.prepareImport = function (_doProcessScripts) { };
  systemJSPrototype.warmup = warmup;

}());
