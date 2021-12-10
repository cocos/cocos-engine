import * as ts from 'typescript';
import * as fs from 'fs-extra';

export namespace interfaceFilter {
    export interface CullingOptions {
        /**
         * The path of input declaration file.
         */
        inputDts: string;
        /**
         * The path of output declaration file.
         * It is set to inputDts by default.
         */
        outputDts?: string;
    }
    
    /**
     * Culling interface.
     * Now we only cull the interface with `@internal` JSDoc tag.
     * @param cullingOptions 
     */
    export function cullInterface(cullingOptions: CullingOptions) {
        console.time('Culling interface');
        const {
            inputDts,
            outputDts = inputDts,
        } = cullingOptions;

        
        const program = ts.createProgram([inputDts], {});
        const checker = program.getTypeChecker();
        
        const transformerFactory: ts.TransformerFactory<ts.Node> = (
            context: ts.TransformationContext
        ) => {
            return (rootNode) => {
                function visit(node: ts.Node): ts.Node | undefined {
                    // @ts-ignore
                    // console.log(syntaxToKind(node.kind) + ' ' + node.text);
                    if (node.kind === ts.SyntaxKind.MethodDeclaration || node.kind === ts.SyntaxKind.PropertyDeclaration) {
                        // @ts-ignore
                        const symbol = checker.getSymbolAtLocation(node.name);
                        const tags = symbol?.getJsDocTags();
                        if (tags) {
                            for (let i = 0; i < tags.length; ++i) {
                                let tag = tags[i];
                                if (tag.name === 'internal') {
                                    // delete interface
                                    return undefined;
                                }
                            }
                        }
                    }
                    node = ts.visitEachChild(node, visit, context);
                    return node;
                }
                return ts.visitNode(rootNode, visit);
            };
        };

        const sourceFiles = program.getSourceFiles();
        const targetInputDts = inputDts.replace(/\\/g, '/');
        const sourceFileIndex = sourceFiles.findIndex(file => file.fileName === targetInputDts);
        const sourceFile = sourceFiles[sourceFileIndex];
        if (sourceFile) {
            const result = ts.transform(sourceFile, [transformerFactory]);
            const printer = ts.createPrinter();
            const printResult = printer.printNode(ts.EmitHint.Unspecified, result.transformed[0] as ts.Node, sourceFile)
            fs.outputFileSync(outputDts, printResult, { encoding: 'utf8' });
        } else {
            console.error('Cannot find source file.');
        }
        console.timeEnd('Culling interface');
    }
}