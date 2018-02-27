var modules = {};

var srcs = scripts.map(function (script) {
    var path = script.path;
    modules[path] = script;

    if (script.mtime) {
        path += `?mtime=${script.mtime}`;
    }

    return path;
});

function loadScript (src, cb) {
    var timer = 'load ' + src;
    var scriptElement = document.createElement('script');

    function done() {
        // console.timeEnd(timer);
        // deallocation immediate whatever
        scriptElement.remove();
    }

    scriptElement.onload = function () {
        done();
        cb();
    };
    scriptElement.onerror = function () {
        done();
        var error = 'Failed to load ' + src;
        console.error(error);
        cb(new Error(error));
    };
    scriptElement.setAttribute('type','text/javascript');
    scriptElement.setAttribute('charset', 'utf-8');
    scriptElement.setAttribute('src', src);

    // console.time(timer);
    document.head.appendChild(scriptElement);
}

function loadScripts (srcs, cb) {
    var n = srcs.length;

    srcs.forEach(function (src) {
        loadScript(src, function () {
            n--;
            if (n === 0) {
                cb();
            }
        });
    })
}

window.__quick_compile__ = {
    registerModule: function (path, module) {
        modules[path].module = module;
    },

    registerModuleFunc: function (path, func) {
        modules[path].func = func;
    },

    require: function (request, path) {
        var m, requestScript;

        if (path) {
            m = modules[path];
            if (!m) {
                console.warn('Can not find module for path : ' + path);
                return null;
            }
        }

        if (m) {
            requestScript = scripts[ m.deps[request] ];
        }
        
        if (!requestScript) {
            if (CC_JSB) {
                return require(request);
            }
            else {
                console.warn('Can not find deps [' + request + '] for path : ' + path);
                return null;
            }
        }

        path = requestScript.path;
        m = modules[path];
        
        if (!m) {
            console.warn('Can not find module for path : ' + path);
            return null;
        }

        if (!m.module && m.func) {
            m.func();
        }

        if (!m.module) {
            console.warn('Can not find module.module for path : ' + path);
            return null;
        }

        return m.module.exports;
    },

    run: function () {
        entries.forEach(function (entry) {
            var module = modules[entry];
            if (!module.module) {
                module.func();
            }
        });
    },

    load: function (cb) {
        var self = this;
        loadScripts(srcs, function () {
            self.run();
            cb();
        });
    }
};
