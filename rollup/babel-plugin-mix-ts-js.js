
const fs = require('fs');
const path = require('path');

Object.defineProperty(exports, "__esModule", { value: true });

exports.default = function(babel) {
    return {
        visitor: {
            ImportDeclaration(babelPath, state) {
                const currentFileName = state.filename;
                const currentFileFolder = path.dirname(currentFileName);

                const source = babelPath.node.source;
                const oldSourcePath = source.value;

                const destPath = path.resolve(currentFileFolder, oldSourcePath);
                if (!fs.existsSync(`${destPath}.ts`)) {
                    return;
                }

                const newSourcePath = `${oldSourcePath}.ts`;
                const newSource = babel.types.stringLiteral(newSourcePath);
                console.log(`Resolve ${oldSourcePath}(${currentFileName}) to ${newSourcePath}`);

                const newPath = babel.types.importDeclaration(babelPath.node.specifiers, newSource);
                babelPath.replaceWith(newPath);
            },
        }
    };
}