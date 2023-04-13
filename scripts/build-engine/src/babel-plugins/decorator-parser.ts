/* eslint-disable space-before-function-paren */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-len */

import * as babel from '@babel/core';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import * as parser from '@babel/parser';

import path from 'path';
import fs from 'fs';

/// type definitions varies by versions
// import * as t from '@babel/types';
declare namespace t {
    type Identifier = any;
    type Import = any;
    type StringLiteral = any;
    type SequenceExpression = any;
    type ClassDeclaration = any;
    type ObjectExpression = any;
    type ObjectMethod = any;
    type ObjectProperty = any;
    type ExportNamedDeclaration = any;
    type ExportDefaultDeclaration = any;
    type ExportAllDeclaration = any;
    type ExportSpecifier = any;
    type ImportDeclaration = any;
    type UpdateExpression = any;
    type ObjectPattern = any;
    type ArrayPattern = any;
    type ArrayExpression = any;
    type ThisExpression = any;
    type Super = any;
    type TSTypeAssertion = any;
    type TSPropertySignature = any;
    type TSMethodSignature = any;
    type TSIndexSignature = any;
    type MemberExpression = any;
    type OptionalMemberExpression = any;
    type VariableDeclaration = any;
    type TSQualifiedName = any;
    type VariableDeclarator = any;
    type FunctionExpression = any;
    type ArrowFunctionExpression = any;
    type NewExpression = any;
    type TryStatement = any;
    type CatchClause = any;
    type BlockStatement = any;
    type ExpressionStatement = any;
    type CallExpression = any;
    type OptionalCallExpression = any;
    type AssignmentPattern = any;
    type AssignmentExpression = any;
    type RestElement = any;
    type SpreadElement = any;
    type LogicalExpression = any;
    type ConditionalExpression = any;
    type BinaryExpression = any;
    type SwitchStatement = any;
    type SwitchCase = any;
    type ThrowStatement = any;
    type BreakStatement = any;
    type ContinueStatement = any;
    type LabeledStatement = any;
    type YieldExpression = any;
    type AwaitExpression = any;
    type IfStatement = any;
    type DoWhileStatement = any;
    type WhileStatement = any;
    type ForInStatement = any;
    type ForOfStatement = any;
    type ForStatement = any;
    type ReturnStatement = any;
    type TSTypeParameterDeclaration = any;
    type TSTypeParameter = any;
    type TSNonNullExpression = any;
    type FunctionDeclaration = any;
    type TSAsExpression = any;
    type TSTypeAnnotation = any;
    type TSTypeParameterInstantiation = any;
    type TSType = any;
    type TSAnyKeyword = any;
    type TSBooleanKeyword = any;
    type TSBigIntKeyword = any;
    type TSIntrinsicKeyword = any;
    type TSNeverKeyword = any;
    type TSNullKeyword = any;
    type TSNumberKeyword = any;
    type TSObjectKeyword = any;
    type TSStringKeyword = any;
    type TSSymbolKeyword = any;
    type TSUndefinedKeyword = any;
    type TSUnknownKeyword = any;
    type TSVoidKeyword = any;
    type TSThisType = any;
    type TSFunctionType = any;
    type TSConstructorType = any;
    type TSTypeReference = any;
    type TSTypePredicate = any;
    type TSTypeQuery = any;
    type TemplateLiteral = any;
    type TemplateElement = any;
    type TSTypeLiteral = any;
    type TSArrayType = any;
    type TSTupleType = any;
    type TSOptionalType = any;
    type TSRestType = any;
    type TSUnionType = any;
    type TSIntersectionType = any;
    type TSConditionalType = any;
    type TSInferType = any;
    type TSParenthesizedType = any;
    type TSTypeOperator = any;
    type TSIndexedAccessType = any;
    type TSMappedType = any;
    type TSLiteralType = any;
    type TSExpressionWithTypeArguments = any;
    type TSImportType = any;
    type BooleanLiteral = any;
    type NumericLiteral = any;
    type NullLiteral = any;
    type RegExpLiteral = any;
    type UnaryExpression = any;
    type Directive = any;
    type DirectiveLiteral = any;
    type EmptyStatement = any;
    type TSTypeAliasDeclaration = any;
    type TSInterfaceDeclaration = any;
}



const enginePath = process.env.ENGINE_PATH!;
const applyFnName = `apply`;

interface DecoratorParseResult {
    decoratorName?: string;
    attrName?: string;
    attrValue?: string;
    decoratorArgs?: string[];
    isGetterOrSetter?: boolean;
}

interface ClassDecoratorContext {
    className: string;
    commands: DecoratorParseResult[];
    descriptors: { name: string, decl: string }[];
    identifiers: string[];
    declTypes: string[];
}

function getParentNodes(path: any): any[] {
    const parents = [];
    let target = path;
    while (target) {
        parents.push(target.node);
        target = target.parentPath;
    }
    parents.reverse();
    return parents;
}

function isInFunctionDeclaration(path: any) {
    return getParentNodes(path.parentPath).some((parent) => parent.type === 'FunctionDeclaration');
}

/**
 * collectt all variables which is defined outside current function and save into `ctx`
 */
function collectGlobalVars(code: string, oldPath: babel.Node, ctx: ClassDecoratorContext) {
    try {
        const ast = parser.parse(code);
        traverse(ast, {
            ReferencedIdentifier(path: any) {
                const name = path.node.name;
                if (path.scope.hasBinding(name, true)) { return; }

                if (name === 'arguments') {
                    if (isInFunctionDeclaration(path)) return;
                }

                if (name in globalThis) {
                    return;
                }
                if (ctx.identifiers.indexOf(path.node.name) === -1) {
                    ctx.identifiers.push(path.node.name);
                }
            },
        } as any);
    } catch (e) {
        try {
            const result = visitAst(oldPath);
            mergeArray(ctx.declTypes, result.types);
            mergeArray(ctx.identifiers, result.identifiers);
        } catch (ee) {
            console.error(ee);
        }
    }
}

/**
 * convert decorators to `DecoratorParsedResult[]`
 */
function parseNodeDecorators(targetNode: any, decorators: any[], classCtx: ClassDecoratorContext): DecoratorParseResult[] {
    const result: DecoratorParseResult[] = [];

    const attrName = targetNode?.key?.name ?? '';
    const attrValue = targetNode.value! ? generate(targetNode.value).code : 'undefined';
    const isGetterOrSetter = targetNode.kind === 'get' || targetNode.kind === 'set';

    if (targetNode.value) {
        collectGlobalVars(attrValue, targetNode.value, classCtx);
    }

    for (const decor of decorators) {
        if (decor.expression.type === 'CallExpression') {
            const content: DecoratorParseResult = { decoratorName: decor.expression.callee.name };
            content.attrName = attrName;
            content.attrValue = attrValue;
            content.isGetterOrSetter = isGetterOrSetter;

            try {
                const argNodesCode = decor.expression.arguments.map((a: any) => {
                    const argCode = generate(a).code;
                    collectGlobalVars(argCode, a, classCtx);
                    return argCode;
                });
                content.decoratorArgs = argNodesCode;
            } catch (e) {
                console.error(`  @[failed]${decor.expression.callee.name as string} / ${targetNode.key.name as string}`);
                continue;
            }
            result.push(content);
        } else if (decor.expression.type === 'Identifier') {
            result.push({ decoratorName: decor.expression.name, attrName, attrValue, isGetterOrSetter });
        } else {
            console.error(`unknown decorator type ${decor.expression.type as string}`);
        }
    }
    return result;
}

// head content for the generated file
const outputLines: string[] = [];
outputLines.push(`/* This file is generated by script, do not modify it manually. */`);
outputLines.push('');
outputLines.push(`/* eslint-disable @typescript-eslint/no-unsafe-return */`);
outputLines.push(`/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */`);
outputLines.push(`/* eslint-disable brace-style */`);
outputLines.push(`/* eslint-disable @typescript-eslint/indent */`);
outputLines.push(`/* eslint-disable max-len */`);
outputLines.push(`/* eslint-disable arrow-body-style */`);
outputLines.push(`/* eslint-disable comma-dangle */`);
outputLines.push(`/* eslint-disable func-names */`);
outputLines.push(`/* eslint-disable space-before-function-paren */`);
outputLines.push('');
outputLines.push(`import * as $$ from 'cc.decorator';`);
outputLines.push(`import { _decorator as $ } from '../core';`);
outputLines.push('');
outputLines.push(`const defaultExec = (cb: () => void, decorator?: string, attr?: string | null) => { cb(); };`);

// write lines to file through IPC messages
function writeLines(lines: string[], className: string) {
    process.emit('message', { event: 'write-decorator', lines, className }, null);
}

writeLines(outputLines, '');

function mergeArray<T>(dst: T[], src: T[]) {
    for (const e of src) {
        if (dst.indexOf(e) === -1) {
            dst.push(e);
        }
    }
}

/**
 * generate variable names for property descriptors
 */
function allocPropVariable(className: string, property: string) {
    return `${property}Descriptor`;
}

function nameDecorators(name: string) {
    if (name.startsWith('rangeM') || name === 'readOnly' || name === 'editorOnly') {
        // these decorators are exported by `import { _decorator as $ } from '../core';`
        // should be referenced from `cc.decorator`
        return `$$.${name}`;
    }
    return `$.${name}`;
}

/**
 * convert class decorator to text
 */
function cvtClassDecorators(className: string) {
    return (d: DecoratorParseResult) => `  ${nameDecorators(d.decoratorName!)}${d.decoratorArgs ? `(${d.decoratorArgs.join(',')})` : ''}(${className})`;
}

/**
 *  convert property decorator to text
 */
function cvtPropDecorators(className: string, ctx: ClassDecoratorContext) {
    return (d: DecoratorParseResult) => {
        let gs: string | undefined;
        if (d.isGetterOrSetter) {
            gs = allocPropVariable(className, d.attrName!);
            const found = ctx.descriptors.reduce((p, c) => p || c.name === gs, false);
            if (!found) {
                ctx.descriptors.push({ name: gs, decl: `const ${gs} = Object.getOwnPropertyDescriptor(${className}.prototype, '${d.attrName as string}');` });
            }
        }
        return `    ${nameDecorators(d.decoratorName!)}${d.decoratorArgs ? `(${d.decoratorArgs.join(',')})` : ''}(${className}.prototype, '${d.attrName}',  ${gs || `() => { return ${d.attrValue}; }`})`;
    };
}

export default function recordDecorators(): babel.PluginObj<any> {
    return {
        name: 'decorator-collector',
        visitor: {
            ClassDeclaration(nodePath, state) {
                const superClass = nodePath.node.superClass;
                let superClassName: string | null = null;
                if (superClass) {
                    if (superClass.type === 'Identifier') {
                        superClassName = superClass.name;
                    } else {
                        superClassName = 'others';
                    }
                }

                if (superClassName === 'Component') {
                    // filter #1, all sub classes of `Component`
                    return;
                } else if (superClassName === 'others') {
                    const fileName = state?.file?.opts?.filename;
                    if (fileName && fileName.indexOf('component') >= 0) {
                        // filter #2, skip files which path contains `component` && may be sub class of Compnonet
                        return;
                    }
                }


                const currentClassName = nodePath.node.id.name;
                const classDecoratorNodes: any[] | undefined | null = nodePath.node.decorators;
                let classDecoratorResults: DecoratorParseResult[] = [];
                if (!classDecoratorNodes) { // filter #3, no decorators for current class
                    return;
                }
                const cppClasses = getExportedClassesFromCppSourceCode();
                if (!cppClasses.has(currentClassName)) { // filter #4, no C++ binding type found with the same name
                    return;
                }

                const detail = cppClasses.get(currentClassName)!;
                if (detail.length > 1) {
                    console.warn(`class ${currentClassName} has ${detail.length} JSB class: ${detail.map((d) => `${d.tip}.${d.name}`).join(', ')}`);
                }

                let classContent: string[] = []; // file content to write for current class

                const decoratorCtx: ClassDecoratorContext = {
                    commands: [],
                    descriptors: [],
                    identifiers: [currentClassName],
                    className: currentClassName,
                    declTypes: [],
                };

                classDecoratorResults = parseNodeDecorators(nodePath.node, classDecoratorNodes, decoratorCtx);
                const classNameByDecorator = classDecoratorResults.filter((x) => x.decoratorName === 'ccclass').map((x: any) => x.decoratorArgs[0].replace(/['"]/g, '').replace(/\./g, '_') as string);
                // filter #5, return if no ccclass found or classes from `sp.` (spine) modules
                // Add more conditions if classes need to be skipped.
                if (classNameByDecorator.length === 0 || classNameByDecorator[0].startsWith('sp_')) {
                    return;
                }
                let classDecorator_Lines = classDecoratorResults.map(cvtClassDecorators(currentClassName));
                classDecorator_Lines = classDecorator_Lines.map((x, idx) => `  ${applyFnName}(() => { ${x.trim()}; }, '${classDecoratorResults[idx].decoratorName}', null);`);
                const ccclassName = classNameByDecorator.length > 0 ? classNameByDecorator[0] : currentClassName;
                const contextArgType = `${ccclassName}_Context_Args`;
                let propDecorator_Lines: string[] = [];
                const children = nodePath.node.body.body as any[];
                for (const decro of children) {
                    if (decro.decorators) {
                        const memberDecorators = parseNodeDecorators(decro, decro.decorators, decoratorCtx);
                        let memberLines = memberDecorators.map(cvtPropDecorators(currentClassName, decoratorCtx));
                        memberLines = memberLines.map((x, idx) => `  ${applyFnName}(() => { ${x.trim()}; }, '${memberDecorators[idx].decoratorName}', '${memberDecorators[idx].attrName}');`);
                        propDecorator_Lines = propDecorator_Lines.concat(memberLines.reverse().join('\n'));
                    }
                }

                // assemble file content
                classContent.push(`\n//---- class ${ccclassName}`);
                classContent.push(`interface ${contextArgType} {`); // argument type interface defination
                if (decoratorCtx.identifiers.length > 0) {
                    for (const id of decoratorCtx.identifiers) {
                        classContent.push(`   ${id}: any;`); // field for argument type
                    }
                }
                classContent.push(`}`);
                classContent.push(`export function patch_${ccclassName}(ctx: ${contextArgType}, ${applyFnName} = defaultExec) {`);
                for (const tp of decoratorCtx.declTypes) {
                    classContent.push(`  type ${tp} = any;`); // type alias using in current funtion, set to any type.
                }

                if (decoratorCtx.identifiers.length > 0) {
                    const contextArgs = decoratorCtx.identifiers;
                    classContent.push(`  const { ${contextArgs.join(', ')} } = { ...ctx };`); // unpack all variables from argument
                }

                if (decoratorCtx.descriptors.length > 0) {
                    // local variables for propert descriptors
                    classContent = classContent.concat(decoratorCtx.descriptors.map((d) => `  ${d.decl}`).join('\n'));
                }
                classContent = classContent.concat(propDecorator_Lines); // property decorators
                classContent = classContent.concat(classDecorator_Lines.reverse().join('\n')); // class decorators
                classContent.push(`} // end of patch_${ccclassName}`);
                writeLines(classContent, ccclassName);
            },
        },
    };
}

const cppClassMap: Map<string, { name: string, file: string, tip: string }[]> = new Map<string, any>();

function getExportedClassesFromCppSourceCode() {
    if (cppClassMap.size > 0) {
        return cppClassMap;
    }

    const cppSourceFiles: string[] = [];
    const toFullPath = (prefix: string) => (filename: string) => path.join(prefix, filename);
    const findInDir = (filterCb: { (p: string): boolean }) => (dir: string) => fs.readdirSync(dir).filter(filterCb).map(toFullPath(dir)).forEach((fp) => cppSourceFiles.push(fp));

    ['native/cocos/bindings/manual', 'native/build/generated/cocos/bindings/auto'].map(toFullPath(enginePath)).forEach(findInDir((x) => x.startsWith('jsb_') && x.endsWith('.cpp')));

    const se_Class_create = /se::Class::create\((\{("\w+",\s*"\w+")+\}|("\w+"))/;

    const skipChars = /["{}]/;

    console.log('searching for exported classes');

    function trimClassName(x: string) {
        let start = 0;
        let end = x.length - 1;
        const len = x.length;
        while (start < len && skipChars.test(x[start])) start++;
        while (end > 0 && skipChars.test(x[end])) end--;
        return start < end ? x.substring(start, end + 1) : '';
    }
    function tideClassName(str: string) {
        return str.split(',').map((x) => trimClassName(x.trim()));
    }

    for (const file of cppSourceFiles) {
        fs.readFileSync(file, 'utf8').split('\n').map((x) => x.trim()).filter((x) => {
            const createClassR = se_Class_create.exec(x);
            if (createClassR) {
                const pathComps = path.basename(file).split('_')[1];
                if (pathComps.includes('dragonbone') || pathComps.includes('spine')) {
                    // filter #6, skip spine/dragonbones binding source files
                    return null;
                }
                const classNameComps = tideClassName(createClassR[1] ? createClassR[1] : createClassR[2]);
                const className = classNameComps[classNameComps.length - 1];
                let classItems = cppClassMap.get(className);
                if (!classItems) {
                    classItems = [];
                    cppClassMap.set(classNameComps[0], classItems);
                }
                classItems.push({ file, name: classNameComps.join('.'), tip: pathComps });
                if (classItems.length > 1) {
                    console.error(`Multiple classes found: ${className} / ${classItems.map((x) => `${path.basename(x.file)}:${x.name}`).join(', ')} . ${file}`);
                }
            }
            return createClassR;
        });
    }
    return cppClassMap;
}

function debugLog(...args: string[]) {
    // console.log.apply(console, args);
}

class VisitContext {
    identifiers: string[] = [];
    types: string[] = [];

    addIdentifier(identifier: string) {
        if (this.identifiers.indexOf(identifier) === -1) {
            this.identifiers.push(identifier);
        }
    }

    addType(type: string) {
        if (this.types.indexOf(type) === -1) {
            this.types.push(type);
        }
    }

    reset() {
        this.identifiers.length = 0;
        this.types.length = 0;
    }

    dump() {
        if (this.types.length > 0 || this.identifiers.length > 0) {
            console.log(`types: ${this.types.join(',')}`);
            console.log(`identifiers: ${this.identifiers.join(',')}`);
        }
    }
}

const context = new VisitContext();

namespace p {

    export function Identifier(np: t.Identifier) {
        if (np.typeAnnotation) {
            // context.addType(np.typeAnnotation);
            visitAstRecursive(np.typeAnnotation);
        }
        debugLog(`[${np.type}] ${np.name}`);
    }

    export function Import(np: t.Import) {
        debugLog(`[import]`);
    }

    export function StringLiteral(np: t.StringLiteral) {
        debugLog(`[${np.type}] "${np.value}"`);
    }

    export function SequenceExpression(np: t.SequenceExpression) {
        debugLog(`[sequence expression]`);
        for (const d of np.expressions) {
            visitAstRecursive(d);
        }
    }

    export function ClassDeclaration(np: t.ClassDeclaration) {
        debugLog(`[class def] skipped`);
    }

    export function ObjectExpression(np: t.ObjectExpression) {
        for (const p of np.properties) {
            visitAstRecursive(p);
        }
    }

    export function ObjectMethod(np: t.ObjectMethod) {
        debugLog(`[obj method] ${np.kind}`);
        visitAstRecursive(np.key);
        for (const p of np.params) {
            visitAstRecursive(p);
        }
        visitAstRecursive(np.body);
        if (np.returnType) visitAstRecursive(np.returnType);
        if (np.typeParameters) visitAstRecursive(np.typeParameters);
    }

    export function ObjectProperty(np: t.ObjectProperty) {
        debugLog(`[obj property]`);
        visitAstRecursive(np.key);
        visitAstRecursive(np.value);
    }

    export function ExportNamedDeclaration(np: t.ExportNamedDeclaration) {
        console.error(`[export named] skipped`);
    }

    export function ExportDefaultDeclaration(np: t.ExportDefaultDeclaration) {
        console.error(`[export default] skipped`);
    }

    export function ExportAllDeclaration(np: t.ExportAllDeclaration) {
        console.error(`[export all] skipped`);
    }

    export function ExportSpecifier(np: t.ExportSpecifier) {
        console.error(`[export specifier] skipped`);
    }

    export function ImportDeclaration(np: t.ImportDeclaration) {
        console.error(`[import declaration] skipped`);
    }

    export function UpdateExpression(np: t.UpdateExpression) {
        debugLog(`[update] ${np.operator}, prefix: ${np.prefix}`);
        visitAstRecursive(np.argument);
    }

    export function ObjectPattern(np: t.ObjectPattern) {
        debugLog(`[objectpattern]`);
        for (const p of np.properties) {
            visitAstRecursive(p);
        }
        if (np.typeAnnotation) {
            visitAstRecursive(np.typeAnnotation);
        }
    }

    export function ArrayPattern(np: t.ArrayPattern) {
        debugLog(`[arraypattern]`);
        for (const p of np.elements) {
            if (p) { // TODO: handle null elements
                visitAstRecursive(p);
            }
        }
        if (np.typeAnnotation) {
            visitAstRecursive(np.typeAnnotation);
        }
    }

    export function ArrayExpression(np: t.ArrayExpression) {
        for (const ele of np.elements) {
            if (ele) visitAstRecursive(ele); // skip null elements?
        }
    }

    export function ThisExpression(np: t.ThisExpression) {
        debugLog(`[this]`);
    }

    export function Super(np: t.Super) {
        debugLog(`[super]`);
    }

    export function TSTypeAssertion(np: t.TSTypeAssertion) {
        debugLog(`[type assertion]`);
        visitAstRecursive(np.typeAnnotation);
        visitAstRecursive(np.expression);
    }

    export function TSPropertySignature(np: t.TSPropertySignature) {
        debugLog(`[ts prop]`);
        visitAstRecursive(np.key);
        if (np.initializer) visitAstRecursive(np.initializer);
        if (np.typeAnnotation) visitAstRecursive(np.typeAnnotation);
    }

    export function TSMethodSignature(np: t.TSMethodSignature) {
        debugLog(`[ts method]`);
        visitAstRecursive(np.key);
        for (const p of np.parameters) {
            visitAstRecursive(p);
        }
        if (np.typeParameters) visitAstRecursive(np.typeParameters);
        if (np.typeAnnotation) visitAstRecursive(np.typeAnnotation);
    }

    export function TSIndexSignature(np: t.TSIndexSignature) {
        debugLog(`[ts index]`);
        for (const p of np.parameters) {
            visitAstRecursive(p);
        }
        if (np.typeAnnotation) visitAstRecursive(np.typeAnnotation);
    }

    export function MemberExpression(np: t.MemberExpression) {
        debugLog(`[member]: optional ${np.optional}`);
        visitAstRecursive(np.object);
        visitAstRecursive(np.property);
        if (np.object.type === 'Identifier') {
            context.addIdentifier(np.object.name);
        }
    }

    export function OptionalMemberExpression(np: t.OptionalMemberExpression) {
        debugLog(`[optional-member]: optional ${np.optional}`);
        visitAstRecursive(np.object);
        visitAstRecursive(np.property);
    }

    export function VariableDeclaration(np: t.VariableDeclaration) {
        debugLog(`[var] ${np.kind}`);
        for (const v of np.declarations) {
            visitAstRecursive(v);
        }
    }

    export function TSQualifiedName(np: t.TSQualifiedName) {
        debugLog(`[qualified]`);
        visitAstRecursive(np.left);
        visitAstRecursive(np.right);
    }

    export function VariableDeclarator(np: t.VariableDeclarator) {
        debugLog(`[var instant] definite ${np.definite}`);
        visitAstRecursive(np.id);
        if (np.init) visitAstRecursive(np.init);
    }

    export function FunctionExpression(np: t.FunctionExpression) {
        debugLog(`[function]`);
        if (np.id) { visitAstRecursive(np.id); }
        // param
        if (np.params) {
            for (const p of np.params) {
                visitAstRecursive(p);
            }
        }
        // body
        if (np.body) {
            visitAstRecursive(np.body);
        }
        if (np.returnType) {
            visitAstRecursive(np.returnType);
        }

        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
    }

    export function ArrowFunctionExpression(np: t.ArrowFunctionExpression) {
        debugLog(`[arrow-function]`);
        // param
        for (const p of np.params) {
            if (p) visitAstRecursive(p); // null should be acceptable
        }
        // body
        visitAstRecursive(np.body);
        if (np.returnType) {
            visitAstRecursive(np.returnType);
        }

        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
        if (np.predicate) {
            visitAstRecursive(np.predicate);
        }
    }

    export function NewExpression(np: t.NewExpression) {
        debugLog(`[new]`);
        visitAstRecursive(np.callee);
        for (const p of np.arguments) {
            visitAstRecursive(p);
        }
        if (np.typeArguments) {
            visitAstRecursive(np.typeArguments);
        }

        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
    }

    export function TryStatement(np: t.TryStatement) {
        debugLog(`[TryStatement]`);
        visitAstRecursive(np.block);
        if (np.handler) visitAstRecursive(np.handler);
        if (np.finalizer) visitAstRecursive(np.finalizer);
    }

    export function CatchClause(np: t.CatchClause) {
        debugLog(`[CatchClause]`);
        if (np.param) visitAstRecursive(np.param);
        visitAstRecursive(np.body);
    }

    export function BlockStatement(np: t.BlockStatement) {
        debugLog(`[block]`);
        for (const d of np.directives) {
            visitAstRecursive(d);
        }
        for (const p of np.body) {
            visitAstRecursive(p);
        }
    }

    export function ExpressionStatement(np: t.ExpressionStatement) {
        debugLog(`[expression]`);
        visitAstRecursive(np.expression);
    }

    export function CallExpression(np: t.CallExpression) {
        debugLog(`[call]`);
        visitAstRecursive(np.callee);
        for (const a of np.arguments) {
            visitAstRecursive(a);
        }
        if (np.typeArguments) {
            visitAstRecursive(np.typeArguments);
        }
        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
    }

    export function OptionalCallExpression(np: t.OptionalCallExpression) {
        debugLog(`[optional call?]`);
        visitAstRecursive(np.callee);
        for (const a of np.arguments) {
            visitAstRecursive(a);
        }
        if (np.typeArguments) {
            visitAstRecursive(np.typeArguments);
        }
        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
    }

    export function AssignmentPattern(np: t.AssignmentPattern) {
        debugLog(`[assignment pattern] optional: ${np.optional}`);
        visitAstRecursive(np.left);
        visitAstRecursive(np.right);
        if (np.typeAnnotation) {
            visitAstRecursive(np.typeAnnotation);
        }
    }

    export function AssignmentExpression(np: t.AssignmentExpression) {
        debugLog(`[assignment] ${np.operator}`);
        visitAstRecursive(np.left);
        visitAstRecursive(np.right);
    }

    export function RestElement(np: t.RestElement) {
        debugLog(`[rest element] optional: ${np.optional}`);
        visitAstRecursive(np.argument);
        if (np.typeAnnotation) {
            visitAstRecursive(np.typeAnnotation);
        }
    }

    export function SpreadElement(np: t.SpreadElement) {
        debugLog(`[spread]`);
        visitAstRecursive(np.argument);
    }

    export function LogicalExpression(np: t.LogicalExpression) {
        debugLog(`[logical] ${np.operator}`);
        visitAstRecursive(np.left);
        visitAstRecursive(np.right);
    }

    export function ConditionalExpression(np: t.ConditionalExpression) {
        debugLog(`[conditional] ${np.test}`);
        visitAstRecursive(np.test);
        visitAstRecursive(np.consequent);
        visitAstRecursive(np.alternate);
    }

    export function BinaryExpression(np: t.BinaryExpression) {
        debugLog(`[binary] ${np.operator}`);
        visitAstRecursive(np.left);
        visitAstRecursive(np.right);
    }

    export function SwitchStatement(np: t.SwitchStatement) {
        debugLog(`[switch]`);
        visitAstRecursive(np.discriminant);
        for (const c of np.cases) {
            visitAstRecursive(c);
        }
    }

    export function SwitchCase(np: t.SwitchCase) {
        debugLog(`[switch cast]`);
        if (np.test) visitAstRecursive(np.test);
        for (const c of np.consequent) {
            visitAstRecursive(c);
        }
    }

    export function ThrowStatement(np: t.ThrowStatement) {
        debugLog(`[throw]`);
        visitAstRecursive(np.argument);
    }

    export function BreakStatement(np: t.BreakStatement) {
        debugLog(`[break]`);
        if (np.label) visitAstRecursive(np.label);
    }

    export function ContinueStatement(np: t.ContinueStatement) {
        debugLog(`[continue]`);
        if (np.label) visitAstRecursive(np.label);
    }

    export function LabeledStatement(np: t.LabeledStatement) {
        debugLog(`[label]`);
        visitAstRecursive(np.label);
        visitAstRecursive(np.body);
    }

    export function YieldExpression(np: t.YieldExpression) {
        debugLog(`[yield] delegate ${np.delegate}`);
        if (np.argument) visitAstRecursive(np.argument);
    }

    export function AwaitExpression(np: t.AwaitExpression) {
        debugLog(`[await]`);
        visitAstRecursive(np.argument);
    }

    export function IfStatement(np: t.IfStatement) {
        debugLog(`[if]`);
        visitAstRecursive(np.test);
        visitAstRecursive(np.consequent);
        if (np.alternate) {
            visitAstRecursive(np.alternate);
        }
    }
    export function DoWhileStatement(np: t.DoWhileStatement) {
        debugLog(`[do while]`);
        visitAstRecursive(np.body);
        visitAstRecursive(np.test);
    }

    export function WhileStatement(np: t.WhileStatement) {
        debugLog(`[while]`);
        visitAstRecursive(np.test);
        visitAstRecursive(np.body);
    }

    export function ForInStatement(np: t.ForInStatement) {
        debugLog(`[for in]`);
        visitAstRecursive(np.left);
        visitAstRecursive(np.right);
        visitAstRecursive(np.body);
    }

    export function ForOfStatement(np: t.ForOfStatement) {
        debugLog(`[for of]`);
        visitAstRecursive(np.left);
        visitAstRecursive(np.right);
        visitAstRecursive(np.body);
    }

    export function ForStatement(np: t.ForStatement) {
        debugLog(`[for]`);
        if (np.init) visitAstRecursive(np.init);
        if (np.test) visitAstRecursive(np.test);
        if (np.update) visitAstRecursive(np.update);
        visitAstRecursive(np.body);
    }

    export function ReturnStatement(np: t.ReturnStatement) {
        debugLog(`[return]`);
        if (np.argument) {
            visitAstRecursive(np.argument);
        }
    }

    export function TSTypeParameterDeclaration(np: t.TSTypeParameterDeclaration) {
        debugLog(`[parameter decl]`);
        for (const p of np.params) {
            visitAstRecursive(p);
        }
    }

    export function TSTypeParameter(np: t.TSTypeParameter) {
        debugLog(`[type parameter] ${np.name}, const ${np.const}, in: ${np.in}, out: ${np.out}`);
        if (np.constraint) visitAstRecursive(np.constraint);
        if (np.default) visitAstRecursive(np.default);
    }

    export function TSNonNullExpression(np: t.TSNonNullExpression) {
        debugLog(`[non-null]`);
        visitAstRecursive(np.expression);
    }

    export function FunctionDeclaration(np: t.FunctionDeclaration) {
        debugLog(`[function-decl]`);
        if (np.id) visitAstRecursive(np.id);
        for (const p of np.params) {
            visitAstRecursive(p);
        }

        visitAstRecursive(np.body);
        if (np.returnType) {
            visitAstRecursive(np.returnType);
        }
        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
    }

    export function TSAsExpression(np: t.TSAsExpression) {
        debugLog(`[as]`);
        visitAstRecursive(np.expression);
        visitAstRecursive(np.typeAnnotation);
    }

    export function TSTypeAnnotation(np: t.TSTypeAnnotation) {
        debugLog(`[typeAnnotation]`);
        visitAstRecursive(np.typeAnnotation);
    }

    export function TSTypeParameterInstantiation(np: t.TSTypeParameterInstantiation) {
        debugLog(`[type-instantiation]`);
        for (const t of np.params) {
            visitAstRecursive(t);
        }
    }

    export function TSType(np: t.TSType) {

    }
    export function TSAnyKeyword(np: t.TSAnyKeyword) {
        debugLog(`[TSType] any`);
    }

    export function TSBooleanKeyword(np: t.TSBooleanKeyword) {
        debugLog(`[TSType] boolean`);
    }

    export function TSBigIntKeyword(np: t.TSBigIntKeyword) {
        debugLog(`[TSType] BigInt`);
    }
    export function TSIntrinsicKeyword(np: t.TSIntrinsicKeyword) {
        debugLog(`[TSType] instrinsic`);
    }
    export function TSNeverKeyword(np: t.TSNeverKeyword) {
        debugLog(`[TSType] never`);
    }
    export function TSNullKeyword(np: t.TSNullKeyword) {
        debugLog(`[TSType] null`);
    }
    export function TSNumberKeyword(np: t.TSNumberKeyword) {
        debugLog(`[TSType] number`);
    }
    export function TSObjectKeyword(np: t.TSObjectKeyword) {
        debugLog(`[TSType] object`);
    }
    export function TSStringKeyword(np: t.TSStringKeyword) {
        debugLog(`[TSType] string`);
    }
    export function TSSymbolKeyword(np: t.TSSymbolKeyword) {
        debugLog(`[TSType] symbol`);
    }
    export function TSUndefinedKeyword(np: t.TSUndefinedKeyword) {
        debugLog(`[TSType] undefined`);
    }
    export function TSUnknownKeyword(np: t.TSUnknownKeyword) {
        debugLog(`[TSType] unknown`);
    }
    export function TSVoidKeyword(np: t.TSVoidKeyword) {
        debugLog(`[TSType] void`);
    }
    export function TSThisType(np: t.TSThisType) {
        debugLog(`[TSType] this`);
    }
    export function TSFunctionType(np: t.TSFunctionType) {
        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
        for (const p of np.parameters) {
            visitAstRecursive(p);
        }
        if (np.typeAnnotation) {
            visitAstRecursive(np.typeAnnotation);
        }
    }

    export function TSConstructorType(np: t.TSConstructorType) {
        console.error(`[TSType] constructor not allowed`);
    }

    export function TSTypeReference(np: t.TSTypeReference) {
        visitAstRecursive(np.typeName);
        if (np.typeName.type === 'Identifier') {
            context.addType(np.typeName.name);
        }
    }

    export function TSTypePredicate(np: t.TSTypePredicate) {
        visitAstRecursive(np.parameterName);
        if (np.typeAnnotation) visitAstRecursive(np.typeAnnotation);
    }
    export function TSTypeQuery(np: t.TSTypeQuery) {
        visitAstRecursive(np.exprName);
        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
    }
    export function TemplateLiteral(np: t.TemplateLiteral) {
        debugLog(`[Template literal]`);
        for (const e of np.quasis) {
            visitAstRecursive(e);
        }
        for (const e of np.expressions) {
            visitAstRecursive(e);
        }
    }

    export function TemplateElement(np: t.TemplateElement) {
        debugLog(`[templ element] raw: ${np.value.raw}, cooked: ${np.value.cooked}, tail: ${np.tail}`);
    }

    export function TSTypeLiteral(np: t.TSTypeLiteral) {
        debugLog(`[TSType] type literal`);
        for (const p of np.members) {
            visitAstRecursive(p);
        }
    }

    export function TSArrayType(np: t.TSArrayType) {
        debugLog(`[TSType] array`);
        visitAstRecursive(np.elementType);
    }

    export function TSTupleType(np: t.TSTupleType) {
        debugLog(`[TSType] tuple`);
        for (const p of np.elementTypes) {
            visitAstRecursive(p);
        }
    }

    export function TSOptionalType(np: t.TSOptionalType) {
        debugLog(`[TSType] optional`);
        visitAstRecursive(np.typeAnnotation);
    }
    export function TSRestType(np: t.TSRestType) {
        debugLog(`[TSType] rest`);
        visitAstRecursive(np.typeAnnotation);
    }
    export function TSUnionType(np: t.TSUnionType) {
        debugLog(`[TSType] union`);
        for (const p of np.types) {
            visitAstRecursive(p);
        }
    }
    export function TSIntersectionType(np: t.TSIntersectionType) {
        debugLog(`[TSType] intersection`);
        for (const p of np.types) {
            visitAstRecursive(p);
        }
    }

    export function TSConditionalType(np: t.TSConditionalType) {
        debugLog(`[TSType] conditonal`);
        visitAstRecursive(np.checkType);
        visitAstRecursive(np.extendsType);
        visitAstRecursive(np.trueType);
        visitAstRecursive(np.falseType);
    }
    export function TSInferType(np: t.TSInferType) {
        debugLog(`[TSType] infer`);
        visitAstRecursive(np.typeParameter);
    }
    export function TSParenthesizedType(np: t.TSParenthesizedType) {
        debugLog(`[TSType] parenthesized`);
        visitAstRecursive(np.typeAnnotation);
    }
    export function TSTypeOperator(np: t.TSTypeOperator) {
        debugLog(`[TSType] operator ${np.operator}`);
        visitAstRecursive(np.typeAnnotation);
    }
    export function TSIndexedAccessType(np: t.TSIndexedAccessType) {
        debugLog(`[TSType] index access`);
        visitAstRecursive(np.objectType);
        visitAstRecursive(np.indexType);
    }
    export function TSMappedType(np: t.TSMappedType) {
        debugLog(`[TSType] mapped`);
        visitAstRecursive(np.typeParameter);
        if (np.typeAnnotation) {
            visitAstRecursive(np.typeAnnotation);
        }
        if (np.nameType) {
            visitAstRecursive(np.nameType);
        }
    }
    export function TSLiteralType(np: t.TSLiteralType) {
        debugLog(`[TSType] literal`);
        visitAstRecursive(np.literal);
    }
    export function TSExpressionWithTypeArguments(np: t.TSExpressionWithTypeArguments) {
        debugLog(`[TSType] expression with type arguments`);
        visitAstRecursive(np.expression);
        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
    }
    export function TSImportType(np: t.TSImportType) {
        console.error(`[TSType ] should skip import`);
    }
    export function BooleanLiteral(np: t.BooleanLiteral) {
        debugLog(`[bool] ${np.value}`);
    }
    export function NumericLiteral(np: t.NumericLiteral) {
        debugLog(`[numberic] ${np.value}`);
    }
    export function NullLiteral(np: t.NullLiteral) {
        debugLog(`[null]`);
    }
    export function RegExpLiteral(np: t.RegExpLiteral) {
        debugLog(`[regexp] ${np.pattern} / ${np.flags}`);
    }

    export function UnaryExpression(np: t.UnaryExpression) {
        debugLog(`[unary] ${np.operator}, prefix: ${np.prefix}`);
        visitAstRecursive(np.argument);
    }

    export function Directive(np: t.Directive) {
        debugLog(`[directive] ${np.value}`);
    }

    export function DirectiveLiteral(np: t.DirectiveLiteral) {
        debugLog(`[directive literal] ${np.value}`);
    }

    export function EmptyStatement(np: t.EmptyStatement) {
        debugLog(`[empty]`);
    }

    export function TSTypeAliasDeclaration(np: t.TSTypeAliasDeclaration) {
        debugLog(`[type alias] declare ${np.declare}`);
        visitAstRecursive(np.id);
        if (np.typeParameters) visitAstRecursive(np.typeParameters);
        visitAstRecursive(np.typeAnnotation);
    }

    export function TSInterfaceDeclaration(np: t.TSInterfaceDeclaration) {
        debugLog(`[ts interface declaration]`);
        visitAstRecursive(np.id);
        if (np.typeParameters) {
            visitAstRecursive(np.typeParameters);
        }
        visitAstRecursive(np.body);
        if (np.extends) {
            for (const p of np.extends) {
                visitAstRecursive(p);
            }
        }
    }
}

function visitAstRecursive(ast: any) {
    const node = ast.node ? ast.node : ast;
    const nodeVisitor = (p as any)[node.type];
    if (nodeVisitor) {
        try {
            nodeVisitor(node);
        } catch (e) {
            console.error(e);
        }
    } else {
        console.error(`Unsupported node type: ${node.type}`);
    }
}

function visitAst(ast: babel.Node) {
    context.reset();
    visitAstRecursive(ast);
    return context;
}
