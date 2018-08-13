
// Based on https://github.com/substack/browser-pack/blob/master/prelude.js

// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles

(function outer (modules, cache, entry) {
    function newRequire(name, jumped){
        var module = cache[name];
        if(!module) {
            var moduleData = modules[name];
            if(!moduleData) {
                // this module is excluded from engine
                return undefined;
            }
            var exports = {};
            module = cache[name] = {exports: exports};
            moduleData[0](function(x){
                return newRequire(moduleData[1][x] || x);
            },module,exports);
        }
        return module.exports;
    }
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);

    // Override the current require with this new one
    return newRequire;
})
