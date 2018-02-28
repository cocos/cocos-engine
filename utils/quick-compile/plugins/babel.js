const Babel = require('babel-core');

module.exports = function () {
    return {
        transform (script) {
            if (script.src.indexOf('.json') !== -1) {
                return;
            }
            
            let result = Babel.transform(script.source, {
                ast: false,
                highlightCode: false,
                // TODO - disable transform-strict-mode
                sourceMaps: 'inline',
                compact: false,
                filename: script.src, // search path for babelrc
                presets: [
                  'env'
                ],
                plugins: [
                    // // make sure that transform-decorators-legacy comes before transform-class-properties.
                    // 'transform-decorators-legacy',
                    // 'transform-class-properties',
    
                    // 'add-module-exports',
                ],
            });
    
            script.source = result.code;
        }
    };
};
