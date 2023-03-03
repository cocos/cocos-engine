// fix: WebAssembly.instantiate not working well on V8.
(function injectWebAssembly() {
    if (!window.WebAssembly) {
        console.warn('WebAssembly is not supported!');
        return;
    }

    console.info('injectWebAssembly ...');

    const oldWebAssemblyInstantiate = WebAssembly.instantiate;

    WebAssembly.compile = function(bufferSource) {
        return new Promise((resolve, reject)=>{
            if (!bufferSource) {
                reject('WebAssembly.compile: Invalid buffer source!');
            }
            else {
                resolve(new WebAssembly.Module(bufferSource));
            }
        });
    }

    WebAssembly.instantiate = function(bufferSourceOrModule, importObject) {
        let ret;
        if (bufferSourceOrModule instanceof WebAssembly.Module) {
            ret = oldWebAssemblyInstantiate(bufferSourceOrModule, importObject);
        }
        else {
            ret = new Promise((resolve, reject)=>{
                WebAssembly.compile(bufferSourceOrModule)
                .then((mod)=>{
                    oldWebAssemblyInstantiate(mod, importObject)
                    .then((instance)=>{
                        resolve({
                            instance: instance,
                            module: mod
                        });
                    })
                    .catch(reject);
                })
                .catch(reject);
            });
        }

        return ret;
    };
})();
