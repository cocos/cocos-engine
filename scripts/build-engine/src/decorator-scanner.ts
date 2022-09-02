import { template, types as t } from "@babel/core";
import type { Visitor } from "@babel/traverse";
// @ts-expect-error
import syntaxDecorators from "@babel/plugin-syntax-decorators";

function hasClassDecorators(classNode: any) {
  return !!(classNode.decorators && classNode.decorators.length);
}

function hasMethodDecorators(body: any) {
  return body.some((node: any) => node.decorators?.length);
}

export const outputs: string[] = [];

function stringify (node: any): any {
  if (node.type === 'StringLiteral') {
    return `'${node.value}'`;
  } else if (node.type === 'Identifier') {
      return node.name;
  } else if (node.type === 'TemplateLiteral') { 
      return 'unknown'; 
  } else if (node.type === 'ArrayExpression') { 
      return `[${node.elements.map((element: any) => stringify(element)).join(', ')}]`
  } else if (node.type === 'NumericLiteral') { 
      return node.value; 
  } else if (node.type === 'BooleanLiteral') { 
      return node.value ? 'true' : 'false'; 
  } else if (node.type === 'FunctionExpression') {
      return `function ${node.id ? node.id.name : '' }(${ node.params.map((element: any) => stringify(element)).join(', ') }) { /* Need to copy source code */ }`; 
  } else if (node.type === 'UnaryExpression') {
      return `${node.operator}${stringify(node.argument)}`; 
  } else if (node.type === 'ObjectExpression') { 
    return `{ ${node.properties.map((property: any) => `${property.key.name}: ${stringify(property.value)}`).join(', ')} }`
  } else if (node.type === 'ArrowFunctionExpression') { 
    return `(${ node.params.map((element: any) => stringify(element)).join(', ') }) => { /* Need to copy source code */ }`;  
  } else if (node.type === 'MemberExpression') { 
    return `${node.object.name}.${node.property.name}`;
  }
  throw new Error('unknown type'); 
}

function handleDecorator (decorator: any) {
    if (decorator.expression.type === 'Identifier') {
        return decorator.expression.name;
    } else if (decorator.expression.type === 'CallExpression') {
        const args = decorator.expression.arguments.map((arg: any) => {
          return stringify(arg);
        }).join(', ');
        return decorator.expression.callee.name + `(${args})`;
    } else {
      throw new Error('unknown type'); 
    }
}

const visitor = {
  ExportDefaultDeclaration(path) {
    const decl = path.get("declaration");
    if (!decl.isClassDeclaration()) return;
  },
  ClassDeclaration(path) {
  },
  ClassExpression(path: any, state: any) {
    if (!hasClassDecorators(path.node) && !hasMethodDecorators(path.node.body.body)) return;
    outputs.push('---------class ' + path.node.id.name + ' region start-----------');
    if (hasMethodDecorators(path.node.body.body)) {
        outputs.push(`const ${path.node.id.name}Proto = ${path.node.id.name}.prototype;`);
        path.node.body.body.forEach((node: any) => {
            // if (node.decorators) {
            //   if ((node.type !== 'ClassMethod')) {
            //     node.decorators.reverse().forEach((decorator: any) => outputs.push(handleDecorator(decorator)+ `(${path.node.id.name}Proto, '${node.key.name}');`));
            //   } else if (node.kind !== 'method') {
            //     outputs.push(`const ${node.key.name}Descriptor = Object.getOwnPropertyDescriptor(${path.node.id.name}Proto, '${node.key.name}');`);
            //     node.decorators.reverse().forEach((decorator: any) => outputs.push(handleDecorator(decorator)+ `(${path.node.id.name}Proto, '${node.key.name}', ${node.key.name}Descriptor);`));
            //   }
                
            //   //node.decorators.forEach((decorator: any) => (handleDecorator(decorator)+ `(${path.node.id.name}.prototype, '${node.key.name}')`));
            // }
            node.decorators = null;
        });
    }
    if (hasClassDecorators(path.node)) {
      if (path.node.decorators) {
          // path.node.decorators.reverse().forEach((decorator: any) => outputs.push(handleDecorator(decorator) + `(${path.node.id.name});`));
          //path.node.decorators.forEach((decorator: any) => (handleDecorator(decorator) + `(${path.node.id.name})`));
      }
      path.node.decorators = null;
  }
    outputs.push('---------class ' + path.node.id.name + ' region end-----------');
  },
  ObjectExpression(path: any, state: any) {
    path.node.properties.forEach((node: any) => node.decorators = null);
  },

  AssignmentExpression(path, state) {
  },

  CallExpression(path, state) {
  },
} as Visitor<any>;

export default {
    name: "decorators-scanner",
    inherits: syntaxDecorators,
    visitor,
};