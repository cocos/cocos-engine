import * as ts from 'typescript';
import * as fs from 'fs-extra';

export namespace interfaceFilter {
    export interface InterfaceOptions {
        /**
         * The path of input declaration file.
         */
        inputDts: string;
        /**
         * The path of output declaration file.
         * It is set to inputDts by default.
         */
        outputDts?: string;
        /**
         * Taget jsDoc tag to REMOVE.
         * this tag is `custom_private` by default.
         */
        privateTag?: string;
        /**
         * Taget jsDoc tag to DEPRECATE.
         * this tag is `custom_deprecated` by default.
         */
        deprecateTag?: string;
        /**
         * Deprecate tip for the custom deprecated interface.
         * this is an empty string by default.
         */
        deprecateTip?: string;
    }
    
    /**
     * Culling interface.
     * @param interfaceOptions 
     */
    export function cullInterface(interfaceOptions: InterfaceOptions) {
        console.time('Culling interface');
        const {
            inputDts,
            outputDts = inputDts,
            privateTag = 'custom_private',
            deprecateTag = 'custom_deprecated',
            deprecateTip = '',
        } = interfaceOptions;

        
        const program = ts.createProgram([inputDts], {});
        const checker = program.getTypeChecker();
        
        const transformerFactory: ts.TransformerFactory<ts.Node> = (
            context: ts.TransformationContext
        ) => {
            return (rootNode) => {
                function visit(node: ts.Node): ts.Node | undefined {
                    const SyntaxKind = ts.SyntaxKind;
                    const kind = node.kind;
                    if (kind === SyntaxKind.ClassDeclaration ||
                        kind === SyntaxKind.PropertyDeclaration ||
                        kind === SyntaxKind.GetAccessor ||
                        kind === SyntaxKind.SetAccessor ||
                        kind === SyntaxKind.MethodDeclaration ||

                        kind === SyntaxKind.InterfaceDeclaration ||
                        kind === SyntaxKind.PropertySignature ||
                        kind === SyntaxKind.MethodSignature ||

                        kind === SyntaxKind.FunctionDeclaration ||
                        kind === SyntaxKind.EnumDeclaration) {
                        // @ts-ignore
                        const symbol = checker.getSymbolAtLocation(node.name);
                        const tags = symbol?.getJsDocTags();
                        if (tags) {
                            for (let i = 0; i < tags.length; ++i) {
                                let tag = tags[i];
                                if (tag.name === privateTag) {
                                    // delete interface
                                    return undefined;
                                } else if (tag.name === deprecateTag) {
                                    if (tag.text?.[0]?.text) {
                                        // use custom deprecateTip
                                        return context.factory.createIdentifier(
                                            `/** @deprecated ${tag.text[0].text} */` + node.getText());
                                    }
                                    return context.factory.createIdentifier(
                                        `/** @deprecated ${deprecateTip} */` + node.getText());
                                }
                            }
                        }
                    } else if (kind === SyntaxKind.VariableStatement) {
                        // @ts-ignore VariableStatement can't use TypeChecker
                        const jsDocs = node.jsDoc;
                        if (jsDocs) {
                            for (let jsDoc of jsDocs) {
                                const tags = jsDoc.tags;
                                if (tags) {
                                    for (let tag of tags) {
                                        if (tag.tagName.escapedText === privateTag) {
                                            // delete interface
                                            return undefined;
                                        } else if (tag.tagName.escapedText === deprecateTag) {
                                            // use custom deprecateTip
                                            if (tag.comment) {
                                                return context.factory.createIdentifier(
                                                    `/** @deprecated ${tag.comment} */` + node.getText());
                                            }
                                            return context.factory.createIdentifier(
                                                `/** @deprecated ${deprecateTip} */` + node.getText());
                                        }
                                    }
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