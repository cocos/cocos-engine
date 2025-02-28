if(typeof ral.WebAssembly === 'object' && typeof ral.WebAssembly.instantiateFromFile === 'function'){
    ral.WebAssembly.instantiate = ral.WebAssembly.instantiateFromFile;
    window.CCWebAssembly = ral.WebAssembly;
}