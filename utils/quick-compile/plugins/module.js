const Fs         = require('fire-fs');
const Path       = require('fire-path');
const esprima    = require('esprima');
const estraverse = require('estraverse');
const escodegen  = require('escodegen');
const convert    = require('convert-source-map');
const merge      = require('merge-source-map');

const QUICK_COMPILE_FILE_NAME = '__quick_compile__.js';
const QUICK_COMPILE_CONTENT = Fs.readFileSync(Path.join(__dirname, QUICK_COMPILE_FILE_NAME), 'utf8');

function createCode (scripts, entries) {
    return `
(function () {
var scripts = ${scripts};
var entries = ${entries};

${QUICK_COMPILE_CONTENT}
})();
    `;
}

module.exports = function (opts) {
    let transformPath = function (src, dst, compiler) {
        let relative;
        if (opts.transformPath) {
            relative = opts.transformPath(src, dst, compiler);
        }
        else {
            relative = Path.relative(compiler.out, dst);
        }
        return relative.replace(/\\/g, '/');
    };

    let excludes = opts.excludes || [];
    excludes = excludes.map(exclude => exclude.replace(/\\/g, '/'));

    return {
        nodeModule: true,
        transform (script, compiler) {
            let {src, dst, ast, source} = script;
        
            // put all header in one line, so map will work normally.
            let header = `
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = '${transformPath(src, dst, compiler)}';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile__.registerModule(__filename, module);}`;
        
            let footer = `
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();`;
        
            if (Path.extname(src) === '.json') {
                source = 'module.exports = ' + source;
            }
    
            // parse ast
            ast = ast || esprima.parseScript(source, {loc: true});

            let newAst = esprima.parseScript(header + footer, {loc: true});
            newAst.body[0].expression.callee.body.body[4].body.body.splice(1, 0, ast);
    
            let gen = escodegen.generate(newAst, {
                sourceMap: src,
                sourceMapWithCode: true,
                sourceContent: source
            });
    
            // merge old source map and new source map
            let oldMapObj = convert.fromSource(source),
                oldMap = oldMapObj && oldMapObj.toObject(),
                newMap = JSON.parse(gen.map.toString()),
                mergedMap = merge(oldMap, newMap),
                mapComment = convert.fromObject(mergedMap).toComment()
                ;

            source = gen.code + '\n' + mapComment;
    
            script.ast = newAst;
            script.source = source;
        },

        compileFinished (compiler, done) {
            let cache = compiler._scriptsCache;
            
            cache = cache.filter(s => {
                return excludes.indexOf(s.src) === -1;
            });

            let scripts = cache.map(s => {
                let deps = {};
                for (let k in s.deps) {
                    deps[k] = cache.findIndex(function (item) {
                        return item.src === s.deps[k];
                    });
                }
                
                return {
                    mtime: compiler._mtimes[s.src],
                    deps: deps,
                    path: transformPath(s.src, s.dst, compiler)
                };
            });

            let entries = compiler.entries.map(entry => {
                return transformPath(entry, compiler.getDstPath(entry), compiler);
            });
            let code = createCode(JSON.stringify(scripts), JSON.stringify(entries));
            Fs.writeFileSync(Path.join(compiler.out, QUICK_COMPILE_FILE_NAME), code);
            
            done();
        }
    };
};
